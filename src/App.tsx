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
import VisService from "./services/VisService";
import VehicleBoarding from "./interfaces/VehicleBoarding";
import Vehicle from "./interfaces/Vehicle";
import VehicleCategory from "./interfaces/VehicleCategory";
import VehicleCoupling from "./interfaces/VehicleCoupling";
import VehicleDoor from "./interfaces/VehicleDoor";
import MeasureTool from 'measuretool-googlemaps-v3';

export interface AppProps {}

type AppMode = "FILE_UPLADING" | "STATION_SELECTION" | "STATION_BUILDER";

declare const google: any;

export interface AppState {
	isLoading: boolean;
	mode: AppMode;
	stations: Communication | null;
	selectedStation: Communication | null;
	untouchedFiles: {[key: string]: string};
	map?: google.maps.Map;
	mapObjects: (google.maps.Marker | TxtOverlay)[];
}

const STATION_SEARCH_RADIUS = 0.005;

export default class App extends Component<AppProps, AppState> {
	private mapRef: React.RefObject<HTMLDivElement> = React.createRef();
	private requiredFileNames = ["stops.txt", "pathways.txt"];

	public constructor(props: AppProps) {
		super(props);
		this.state = {
			isLoading: false,
			mode: "FILE_UPLADING",
			stations: null,
			selectedStation: null,
			untouchedFiles: {},
			mapObjects: []
		};
	}

	private handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			this.setState({
				isLoading: true
			});
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
		const fileNames: string[] = [];
		const filePromises = Promise.all(files
			.filter((file: File) => file.name.indexOf(".txt") !== -1)
			.map((file: File) => {
				fileNames.push(file.name);
				return FileService.readUploadedFileAsText(file);
			}));
		
		if (!this.checkRequiredFiles(fileNames)) {
			this.setState({
				isLoading: false
			});
			return;
		}

		this.handleFilePromises(filePromises, fileNames);
	}

	private handleZip(zipFile: Blob | File) {
		JSZip.loadAsync(zipFile).then((zip) => {
			const files: JSZipObject[] = [];
			zip.forEach((relativePath, file) => {
				files.push(file);
			});
			
			const fileNames: string[] = [];
			const filePromises = Promise.all(files
				.filter((file: JSZipObject) => file.name.indexOf(".txt") !== -1)
				.map((file: JSZipObject) => {
					fileNames.push(file.name);
					return file.async("text");
				}));
			
			if (!this.checkRequiredFiles(fileNames)) {
				this.setState({
					isLoading: false
				});
				return;
			}

			this.handleFilePromises(filePromises, fileNames);
		}, function (e) {
			alert(e.message);
		});
	}

	private handleFilePromises(
		filePromises: Promise<string[]>,
		fileNames: string[]
	) {
		let communicationPacket: Communication = {
			stops: [],
			pathways: [],
			vehicleBoardings: [],
			levels: [],
			vehicles: []
		};

		filePromises.then((fileContents: string[]) => {
			const untouchedFiles: {[key: string]: string} = {};
			fileContents.forEach((fileContent: string, fileIndex: number) => {
				const fileExtracted = this.extractData(fileNames[fileIndex], fileContent, communicationPacket);
				if (!fileExtracted) {
					untouchedFiles[fileNames[fileIndex]] = fileContent;
				}
			});

			// Set id's initial values for new stops and pathways
			let minStopId = 0;
			communicationPacket.stops.forEach(stop => {
				if (Number(stop.stopId) < minStopId) {
					minStopId = Number(stop.stopId);
				}
			});
			let minPathwayId = 0;
			communicationPacket.pathways.forEach(pathway => {
				if (Number(pathway.pathwayId) < minPathwayId) {
					minPathwayId = Number(pathway.pathwayId);
				}
			});
			VisService.newStopId = minStopId - 1;
			VisService.newPathwayId = minPathwayId - 1;

			// Attach coordinates to nodes without lat,lng
			communicationPacket.stops = communicationPacket.stops.map(stop => {
				if (stop.stopLat === -1 || stop.stopLon === -1) {
					const station = communicationPacket.stops.find(curStop => curStop.stopId === stop.parentStation);
					if (station) {
						stop.stopLat = station.stopLat;
						stop.stopLon = station.stopLon;
					}
				}
				return stop;
			});

			// Extract vehicles from untouched files
			if (untouchedFiles["vehicle_categories.txt"]
				&& untouchedFiles["vehicle_couplings.txt"]
				&& untouchedFiles["vehicle_doors.txt"]) {
				communicationPacket.vehicles = this.extractVehicles(
					untouchedFiles["vehicle_categories.txt"],
					untouchedFiles["vehicle_couplings.txt"],
					untouchedFiles["vehicle_doors.txt"]);
			}

			console.log(communicationPacket);
			this.setState({
				isLoading: false,
				stations: communicationPacket,
				mode: "STATION_SELECTION",
				untouchedFiles
			}, () => {
				this.showStationsOnMap(communicationPacket.stops);
			});
		});
	}

	private extractVehicles(vehicleCategoriesTxt: string,
		vehicleCouplingsTxt: string,
		vehicleDoorsTxt: string): Vehicle[] {
		
		const vehicles: {[key: string]: Vehicle} = {};
		const categories: VehicleCategory[] = DataService.fromGTFS(vehicleCategoriesTxt, DataService.vehicleCategoryFromGTFS);
		const couplings: VehicleCoupling[] = DataService.fromGTFS(vehicleCouplingsTxt, DataService.vehicleCouplingFromGTFS);
		const doors: VehicleDoor[] = DataService.fromGTFS(vehicleDoorsTxt, DataService.vehicleDoorFromGTFS);

		const categoriesHash: {[key: string]: VehicleCategory} = {};
		categories.forEach(category => {
			categoriesHash[category.vehicleCategoryId] = category;
		});
		const doorsHash: {[key: string]: VehicleDoor[]} = {};
		doors.forEach(door => {
			if (!doorsHash[door.vehicleCategoryId]) {
				doorsHash[door.vehicleCategoryId] = [];
			}
			doorsHash[door.vehicleCategoryId].push(door);
		});

		couplings.forEach(coupling => {
			if (!vehicles[coupling.parentId]) {
				vehicles[coupling.parentId] = {
					...categoriesHash[coupling.parentId],
					children: []
				};
			}
			vehicles[coupling.parentId].children.push({
				vehicleCategoryId: coupling.childId,
				childSequence: coupling.childSequence,
				doors: doorsHash[coupling.childId]
			});
		});

		return Object.values(vehicles);
	}

	private showStationsOnMap(stops: Stop[]) {
		let map: google.maps.Map;
		if (!this.state.map) {
			map = new google.maps.Map(this.mapRef.current);
			new MeasureTool(map, {
				showSegmentLength: true,
				unit: MeasureTool.UnitTypeId.METRIC
			});
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
			map.fitBounds(bounds, 50);
		}
	}

	private checkRequiredFiles(fileNames: string[]): boolean {
		const requiredFileMissing = this.requiredFileNames.some((requiredFileName: string) => {
			return fileNames.findIndex(fileName => fileName === requiredFileName) === -1;
		});
		if (requiredFileMissing) {
			alert("You missed some of the required files: [" + this.requiredFileNames.join(", ") + "]");
			return false;
		}
		else {
			return true;
		}
	}

	private extractData(fileName: string, data: string, communicationPacket: Communication): boolean {
		switch (fileName) {
			case "stops.txt":
				communicationPacket.stops = DataService.fromGTFS(
					data,
					DataService.stopFromGTFS
				);
				return true;
			case "pathways.txt":
				communicationPacket.pathways = DataService.fromGTFS(
					data,
					DataService.pathwayFromGTFS
				);
				return true;
			case "levels.txt":
				communicationPacket.levels = DataService.fromGTFS(
					data,
					DataService.levelFromGTFS
				);
				return true;
			case "vehicle_boardings.txt":
				communicationPacket.vehicleBoardings = DataService.fromGTFS(
					data,
					DataService.vehicleBoardingFromGTFS
				);
				return true;
			default:
				return false;
		}
	}

	private handleStationSave = (dataNew: Communication, deletedStopsIds: string[], deletedPathwaysIds: string[], deletedVehicleBoardingsIds: string[]) => {
		const dataActual = this.state.stations;
		if (dataActual) {
			dataNew.stops.forEach(stop => {
				const stopIndex = dataActual.stops.findIndex(curStop => curStop.stopId === stop.stopId);
				if (stopIndex !== -1) {
					dataActual.stops[stopIndex] = stop;
				}
				else {
					dataActual.stops.push(stop);
				}
			});
			deletedStopsIds.forEach(stopId => {
				const stopIndex = dataActual.stops.findIndex(curStop => curStop.stopId === stopId);
				if (stopIndex !== -1) {
					dataActual.stops.splice(stopIndex, 1);
				}
			});

			dataNew.pathways.forEach(pathway => {
				const pathwayIndex = dataActual.pathways.findIndex(curPathway => curPathway.pathwayId === pathway.pathwayId);
				if (pathwayIndex !== -1) {
					dataActual.pathways[pathwayIndex] = pathway;
				}
				else {
					dataActual.pathways.push(pathway);
				}
			});
			deletedPathwaysIds.forEach(pathwayId => {
				const pathwayIndex = dataActual.pathways.findIndex(curPathway => curPathway.pathwayId === pathwayId);
				if (pathwayIndex !== -1) {
					dataActual.pathways.splice(pathwayIndex, 1);
				}
			});

			dataNew.vehicleBoardings.forEach(vehicleBoardingNew => {
				const vehicleBoardingNewId = DataService.getVehicleBoardingId(vehicleBoardingNew);
				const vehicleBoardingIndex = dataActual.vehicleBoardings.findIndex(
					curVehicleBoarding => DataService.getVehicleBoardingId(curVehicleBoarding) === vehicleBoardingNewId
				);
				if (vehicleBoardingIndex === -1) {
					dataActual.vehicleBoardings.push(vehicleBoardingNew);
				}
			});
			deletedVehicleBoardingsIds.forEach(vehicleBoardingId => {
				const vehicleBoardingIndex = dataActual.vehicleBoardings.findIndex(
					curVehicleBoarding => DataService.getVehicleBoardingId(curVehicleBoarding) === vehicleBoardingId
				);
				if (vehicleBoardingIndex !== -1) {
					dataActual.vehicleBoardings.splice(vehicleBoardingIndex, 1);
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

	private loadSampleDataMsk = () => {
		this.setState({
			isLoading: true
		});
		const sampleZip = fetch("https://kostjerry.github.io/gtfs-station-builder/sample/gtfs-translations-pathways-vehicles-sample.zip");
		sampleZip.then(response => {
			if (response.ok) {
				response.blob().then(sampleZipBlob => {
					this.handleZip(sampleZipBlob);
				});
			}
		});
	}

	private loadSampleDataParis = () => {
		this.setState({
			isLoading: true
		});
		const sampleZip = fetch("https://kostjerry.github.io/gtfs-station-builder/sample/go-deeper-paris.zip");
		sampleZip.then(response => {
			if (response.ok) {
				response.blob().then(sampleZipBlob => {
					this.handleZip(sampleZipBlob);
				});
			}
		});
	}

	private handleStationSelect = (stationId: string) => {
		if (this.state.stations) {
			const station = this.state.stations.stops.find(stop => stop.stopId === stationId);
			if (station) {

				// Filter selected station and its neighbors
				const stationIds = this.state.stations.stops.filter(stop => {
					return ((Math.abs(stop.stopLat - station.stopLat) < STATION_SEARCH_RADIUS)
						&& (Math.abs(stop.stopLon - station.stopLon) < STATION_SEARCH_RADIUS)
						&& (stop.locationType === 1));
				}).map(station => station.stopId);
				let platformIds: string[] = [];
				this.state.stations.stops.forEach(stop => {
					if (stationIds.includes(stop.parentStation || '-1') && (stop.locationType === 0)) {
						platformIds.push(stop.stopId);
					}
				});
				const stops = this.state.stations.stops.filter(stop => {
					return (stationIds.includes(stop.parentStation || '-1')
						|| stationIds.includes(stop.stopId)
						|| platformIds.includes(stop.parentStation || '-1'));
				});

				const stopIds = stops.map(stop => stop.stopId);
				const pathways = this.state.stations.pathways.filter(pathway => {
					return stopIds.includes(pathway.fromStopId) ||
						stopIds.includes(pathway.toStopId);
				});

				const vehicleBoardings = this.state.stations.vehicleBoardings.filter(vehicleBoarding => {
					return stopIds.includes(vehicleBoarding.boardingAreaId);
				});

				this.setState({
					selectedStation: {
						stops,
						pathways,
						vehicleBoardings,
						levels: this.state.stations.levels,
						vehicles: this.state.stations.vehicles
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
			this.setState({
				isLoading: true
			});

			let stopsTxt = DataService.getStopGTFSHeader() + "\n";
			this.state.stations.stops.forEach((stop: Stop) => {
				stopsTxt += DataService.stopToGTFS(stop) + "\n";
			});

			let pathwaysTxt = DataService.getPathwayGTFSHeader() + "\n";
			this.state.stations.pathways.forEach((pathway: Pathway) => {
				pathwaysTxt += DataService.pathwayToGTFS(pathway) + "\n";
			});

			let levelsTxt = DataService.getLevelGTFSHeader() + "\n";
			this.state.stations.levels.forEach((level: Level) => {
				levelsTxt += DataService.levelToGTFS(level) + "\n";
			});

			let vehicleBoardingsTxt = DataService.getVehicleBoardingGTFSHeader() + "\n";
			this.state.stations.vehicleBoardings.forEach((vehicleBoarding: VehicleBoarding) => {
				vehicleBoardingsTxt += DataService.vehicleBoardingToGTFS(vehicleBoarding) + "\n";
			});

			const zip = new JSZip();
			zip.file('stops.txt', stopsTxt);
			zip.file('pathways.txt', pathwaysTxt);
			zip.file('levels.txt', levelsTxt);
			zip.file('vehicle_boardings.txt', vehicleBoardingsTxt);
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
			}).then((blob) => {
				this.setState({
					isLoading: false
				});
				saveAs(blob, "gtfs.zip");
			});
		}
	}

	render() {
		return (
			<div className="gtfs-stations-builder-container">
				{this.state.isLoading && <div className="loader"></div>}

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
						<button onClick={this.loadSampleDataMsk}>LOAD SAMPLE DATA [Moscow pathways and vehicles]</button>
						<br />
						<button onClick={this.loadSampleDataParis}>LOAD SAMPLE DATA [Go deeper Paris pathways]</button>
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
