import React, { Component } from "react";
import "./App.scss";
import StationBuilder from "./components/StationBuilder";
import Communication from "./interfaces/Communication";
import DataService from "./services/DataService";
import JSZip, { JSZipObject } from 'jszip';
import FileService from "./services/FileService";
import Stop from "./interfaces/Stop";
import circleBlackImage from './images/circle-black.png';
import ewayLogo from './images/eway-logo.png';
import TxtOverlay from "./map/TxtOverlay";
import Pathway from "./interfaces/Pathway";
import Level from "./interfaces/Level";
import { saveAs } from 'file-saver';

export interface AppProps {}

type AppMode = "FILE_UPLADING" | "STATION_SELECTION" | "STATION_BUILDER";

declare const google: any;

export interface AppState {
	mode: AppMode;
	stations: Communication | null;
	selectedStation: Communication | null;
	untouchedFiles: {[key: string]: string};
	map?: google.maps.Map;
	mapObjects: (google.maps.Marker | TxtOverlay)[];
}

export default class App extends Component<AppProps, AppState> {
	private mapRef: React.RefObject<HTMLDivElement> = React.createRef();
	private requiredFiles = ["stops.txt", "pathways.txt"]; // "levels.txt"

	public constructor(props: AppProps) {
		super(props);
		this.state = {
			mode: "FILE_UPLADING",
			stations: null,
			selectedStation: null,
			untouchedFiles: {},
			mapObjects: []
		};
	}

	private handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			// Zip
			if (event.target.files.length === 1) {
				const zipFile = event.target.files[0];
				this.handleZip(zipFile);
			}
			// Separate files
			else {
				const files = Array.from(event.target.files);
				this.handleFiles(files);
			}
		}
	}

	private handleFiles(files: File[]) {
		const requiredFileNames: string[] = [];
		const untouchedFileNames: string[] = [];
		let requiredFilePromises;
		let untouchedFilePromises;
		
		requiredFilePromises = Promise.all(files
			.filter((file: File) => this.requiredFiles.indexOf(file.name) !== -1)
			.map((file: File) => {
				requiredFileNames.push(file.name);
				return FileService.readUploadedFileAsText(file);
			}));
		untouchedFilePromises = Promise.all(files
			.filter((file: File) => file.name.indexOf(".txt") !== -1)
			.filter((file: File) => this.requiredFiles.indexOf(file.name) === -1)
			.map((file: File) => {
				untouchedFileNames.push(file.name);
				return FileService.readUploadedFileAsText(file);
			}));
		
		if (!this.checkRequiredFiles(requiredFileNames)) {
			return;
		}

		this.handleFilePromises(
			untouchedFilePromises, 
			requiredFilePromises, 
			untouchedFileNames, 
			requiredFileNames);
	}

	private handleZip(zipFile: Blob | File) {
		const requiredFileNames: string[] = [];
		const untouchedFileNames: string[] = [];
		let requiredFilePromises;
		let untouchedFilePromises;

		JSZip.loadAsync(zipFile).then((zip) => {
			const files: JSZipObject[] = [];
			zip.forEach((relativePath, file) => {
				files.push(file);
			});

			requiredFilePromises = Promise.all(files
				.filter((file: JSZipObject) => this.requiredFiles.indexOf(file.name) !== -1)
				.map((file: JSZipObject) => {
					requiredFileNames.push(file.name);
					return file.async("text");
				}));
			untouchedFilePromises = Promise.all(files
				.filter((file: JSZipObject) => file.name.indexOf(".txt") !== -1)
				.filter((file: JSZipObject) => this.requiredFiles.indexOf(file.name) === -1)
				.map((file: JSZipObject) => {
					untouchedFileNames.push(file.name);
					return file.async("text");
				}));
			
			if (!this.checkRequiredFiles(requiredFileNames)) {
				return;
			}

			this.handleFilePromises(
				untouchedFilePromises, 
				requiredFilePromises, 
				untouchedFileNames, 
				requiredFileNames);
		}, function (e) {
			alert(e.message);
		});
	}

	private handleFilePromises(
		untouchedFilePromises: Promise<string[]>, 
		requiredFilePromises: Promise<string[]>, 
		untouchedFileNames: string[], 
		requiredFileNames: string[]
	) {
		let communicationPacket: Communication = {
			stops: [],
			pathways: [],
			levels: []
		};
		untouchedFilePromises.then((fileContents: string[]) => {
			const untouchedFiles: {[key: string]: string} = {};
			fileContents.forEach((fileContent, fileIndex) => {
				untouchedFiles[untouchedFileNames[fileIndex]] = fileContent;
			});
			requiredFilePromises.then((fileContents: string[]) => {
				fileContents.forEach((content: string, index: number) => {
					this.extractData(requiredFileNames[index], content, communicationPacket);
				});

				this.setState({
					stations: communicationPacket,
					mode: "STATION_SELECTION",
					untouchedFiles
				}, () => {
					this.showStationsOnMap(communicationPacket.stops);
				});
			});
		});
	}

	private showStationsOnMap(stops: Stop[]) {
		let map: google.maps.Map;
		if (!this.state.map) {
			map = new google.maps.Map(this.mapRef.current);
			console.log("Google map initialized");
			this.setState({
				map
			});
		}
		else {
			map = this.state.map;
		}

		if (this.state.mapObjects.length === 0) {
			const bounds = new google.maps.LatLngBounds();
			stops.filter(stop => stop.locationType === 1).forEach(stop => {
				const position = {
					lat: stop.stopLat,
					lng: stop.stopLon
				};
				bounds.extend(position);
				const marker = new google.maps.Marker({
					map,
					position,
					icon: circleBlackImage
				});
				const label = new TxtOverlay(
					new google.maps.LatLng(stop.stopLat, stop.stopLon),
					stop.stopName || "",
					"station-name",
					map
				);
				google.maps.event.addListener(marker, 'click', () => {
					this.handleStationSelect(stop.stopId);
				});
				this.state.mapObjects.push(marker);
				this.state.mapObjects.push(label);
			});
			map.fitBounds(bounds);
		}
	}

	private checkRequiredFiles(fileNames: string[]): boolean {
		const fileMissing = this.requiredFiles.some((requiredFileName: string) => {
			return fileNames.findIndex(name => name === requiredFileName) === -1;
		});
		if (fileMissing) {
			alert("You missed some of the required files: [" + this.requiredFiles.join(", ") + "]");
			return false;
		}
		else {
			return true;
		}
	}

	private extractData(fileName: string, data: string, communicationPacket: Communication): void {
		switch (fileName) {
			case "stops.txt":
				communicationPacket.stops = DataService.fromGTFS(
					data,
					DataService.stopFromGTFS
				);
				break;
			case "pathways.txt":
				communicationPacket.pathways = DataService.fromGTFS(
					data,
					DataService.pathwayFromGTFS
				);
				break;
			case "levels.txt":
				communicationPacket.levels = DataService.fromGTFS(
					data,
					DataService.levelFromGTFS
				);
				break;
		}
	}

	private handleStationSave = (data: Communication, deletedStopsIds: number[], deletedPathwaysIds: number[]) => {
		const dataAll = this.state.stations;
		if (dataAll) {
			data.stops.forEach(stop => {
				const stopIndex = dataAll.stops.findIndex(curStop => curStop.stopId === stop.stopId);
				if (stopIndex !== -1) {
					dataAll.stops[stopIndex] = stop;
				}
				else {
					dataAll.stops.push(stop);
				}
			});
			deletedStopsIds.forEach(stopId => {
				const stopIndex = dataAll.stops.findIndex(curStop => curStop.stopId === stopId);
				if (stopIndex !== -1) {
					dataAll.stops.splice(stopIndex, 1);
				}
			});
			data.pathways.forEach(pathway => {
				const pathwayIndex = dataAll.pathways.findIndex(curPathway => curPathway.pathwayId === pathway.pathwayId);
				if (pathwayIndex !== -1) {
					dataAll.pathways[pathwayIndex] = pathway;
				}
				else {
					dataAll.pathways.push(pathway);
				}
			});
			deletedPathwaysIds.forEach(pathwayId => {
				const pathwayIndex = dataAll.pathways.findIndex(curPathway => curPathway.pathwayId === pathwayId);
				if (pathwayIndex !== -1) {
					dataAll.pathways.splice(pathwayIndex, 1);
				}
			});
			this.setState({
				mode: "STATION_SELECTION"
			});
		}
	}

	private handleStationCancel = () => {
		this.setState({
			mode: "STATION_SELECTION"
		});
	}

	private loadSampleData = () => {
		const sampleZip = fetch("https://kostjerry.github.io/gtfs-station-builder/sample/gtfs-translations-pathways-vehicles-sample.zip");
		sampleZip.then(response => {
			if (response.ok) {
				response.blob().then(sampleZipBlob => {
					this.handleZip(sampleZipBlob);
				});
			}
		});
	}

	private handleStationSelect = (stationId: number) => {
		if (this.state.stations) {
			const station = this.state.stations.stops.find(stop => stop.stopId === stationId);
			if (station) {
				// Filter selected station and its neighbors
				const stationIds = this.state.stations.stops.filter(stop => {
					return ((Math.abs(stop.stopLat - station.stopLat) < 0.005)
						&& (Math.abs(stop.stopLon - station.stopLon) < 0.005)
						&& (stop.locationType === 1));
				}).map(station => station.stopId);
				let platformIds: number[] = [];
				this.state.stations.stops.forEach(stop => {
					if (stationIds.includes(stop.parentStation || -1) && (stop.locationType === 0)) {
						platformIds.push(stop.stopId);
					}
				});
				const stops = this.state.stations.stops.filter(stop => {
					return (stationIds.includes(stop.parentStation || -1)
						|| stationIds.includes(stop.stopId)
						|| platformIds.includes(stop.parentStation || -1));
				});

				const stopIds = stops.map(stop => stop.stopId);
				const pathways = this.state.stations.pathways.filter(pathway => {
					return stopIds.includes(pathway.fromStopId) ||
						stopIds.includes(pathway.toStopId);
				});
				this.setState({
					selectedStation: {
						stops,
						pathways,
						levels: this.state.stations.levels
					},
					mode: "STATION_BUILDER"
				});
			}
		}
	}

	private handleLoadFeedClick = () => {
		this.state.mapObjects.forEach(mapObject => {
			mapObject.setMap(null);
		});
		this.setState({
			mode: "FILE_UPLADING",
			stations: null,
			selectedStation: null,
			untouchedFiles: {},
			mapObjects: []
		});
	}

	private handleDownloadClick = () => {
		if (this.state.stations) {
			let stopsTxt = DataService.getStopGTFSHeader() + "\n";
			let pathwaysTxt = DataService.getPathwayGTFSHeader() + "\n";
			let levelsTxt = DataService.getLevelGTFSHeader() + "\n";
			this.state.stations.stops.forEach((stop: Stop) => {
				stopsTxt += DataService.stopToGTFS(stop) + "\n";
			});
			this.state.stations.pathways.forEach((pathway: Pathway) => {
				pathwaysTxt += DataService.pathwayToGTFS(pathway) + "\n";
			});
			this.state.stations.levels.forEach((level: Level) => {
				levelsTxt += DataService.levelToGTFS(level) + "\n";
			});
			const zip = new JSZip();
			zip.file('stops.txt', stopsTxt);
			zip.file('pathways.txt', pathwaysTxt);
			zip.file('levels.txt', levelsTxt);
			for (const fileName in this.state.untouchedFiles) {
				zip.file(fileName, this.state.untouchedFiles[fileName]);
			}
			
			zip.generateAsync({
				type: "blob",
				platform: "UNIX",
				compression: "DEFLATE",
				compressionOptions: {
					level: 5
				}
			}).then(function (blob) {
				saveAs(blob, "gtfs.zip");
			});
		}
	}

	render() {
		return (
			<div className="container">
				{this.state.mode === "FILE_UPLADING" && (
					<div className="controls">
						<img src={ewayLogo} alt="" />
						<h2>GTFS station builder</h2>
						<div>
							Select stops.txt, pathways.txt and levels.txt (you can also select a .zip containing those files):
						</div>
						<input
							type="file"
							multiple={true}
							onChange={this.handleFileChange}
						/>
						<br />
						<div>OR</div>
						<br />
						<button onClick={this.loadSampleData}>LOAD SAMPLE DATA</button>
					</div>
				)}

				{this.state.mode === "STATION_SELECTION" && this.state.stations && <div>
					<div className="panel">
						<button className="download" onClick={this.handleDownloadClick}>Download</button>
						<button className="load" onClick={this.handleLoadFeedClick}>Load another feed</button>
					</div>
				</div>}
				<div className={"map" + (this.state.mode !== "STATION_SELECTION" ? " hidden" : "")} ref={this.mapRef}></div>

				{this.state.mode === "STATION_BUILDER" && this.state.selectedStation && (
					<StationBuilder
						data={this.state.selectedStation}
						onSave={this.handleStationSave}
						onCancel={this.handleStationCancel}></StationBuilder>
				)}
			</div>
		);
	}
}
