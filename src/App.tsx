import React, { Component } from "react";
import "./App.scss";
import StationBuilder from "./components/StationBuilder";
import Communication from "./interfaces/Communication";
import DataService from "./services/DataService";
import Stop from "./interfaces/Stop";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Pathway from "./interfaces/Pathway";
import Level from "./interfaces/Level";

export interface AppProps {}

export interface AppState {
	editMode: boolean;
	data: Communication;
}

export default class App extends Component<AppProps, AppState> {
	public constructor(props: AppProps) {
		super(props);
		this.state = {
			editMode: false,
			data: {
				stops: [],
				pathways: [],
				levels: []
			}
		};
	}

	private handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			let requiredFiles = ["stops.txt", "levels.txt", "pathways.txt"];
			let requiredFilesCount = requiredFiles.length;
			let communicationPacket: Communication = {
				stops: [],
				pathways: [],
				levels: []
			};
			Array.from(event.target.files).forEach((file: File) => {
				requiredFiles.splice(requiredFiles.indexOf(file.name), 1);
				const fileReader = new FileReader();
				fileReader.onload = () => {
					switch (file.name) {
						case "stops.txt":
							requiredFilesCount--;
							communicationPacket.stops = DataService.fromGTFS(
								fileReader.result ? fileReader.result.toString() : "",
								DataService.stopFromGTFS
							);
							break;
						case "pathways.txt":
							requiredFilesCount--;
							communicationPacket.pathways = DataService.fromGTFS(
								fileReader.result ? fileReader.result.toString() : "",
								DataService.pathwayFromGTFS
							);
							break;
						case "levels.txt":
							requiredFilesCount--;
							communicationPacket.levels = DataService.fromGTFS(
								fileReader.result ? fileReader.result.toString() : "",
								DataService.levelFromGTFS
							);
							break;
					}
					if (requiredFilesCount === 0) {
						this.setState({
							data: communicationPacket,
							editMode: true
						});
					}
				};
				fileReader.readAsText(file);
			});
			if (requiredFiles.length !== 0) {
				alert("Missing files: " + requiredFiles.join(", "));
			}
		}
	};

	private saveStation = (data: Communication) => {
		let stopsTxt = DataService.getStopGTFSHeader() + "\n";
		let pathwaysTxt = DataService.getPathwayGTFSHeader() + "\n";
		let levelsTxt = DataService.getLevelGTFSHeader() + "\n";
		data.stops.forEach((stop: Stop) => {
			stopsTxt += DataService.stopToGTFS(stop) + "\n";
		});
		data.pathways.forEach((pathway: Pathway) => {
			pathwaysTxt += DataService.pathwayToGTFS(pathway) + "\n";
		});
		data.levels.forEach((level: Level) => {
			levelsTxt += DataService.levelToGTFS(level) + "\n";
		});
		const zip = new JSZip();
		zip.file('stops.txt', stopsTxt);
		zip.file('pathways.txt', pathwaysTxt);
		zip.file('levels.txt', levelsTxt);
		zip.generateAsync({ type: "blob" }).then(function (blob) {
			saveAs(blob, "gtfs.zip");
		});
	}

	render() {
		return (
			<div className="container">
				{!this.state.editMode && (
					<div>
						Select stops.txt, pathways.txt and levels.txt:
						<input
							type="file"
							multiple={true}
							onChange={this.handleFileChange}
						/>
					</div>
				)}
				{this.state.editMode && (
					<StationBuilder data={this.state.data} onSave={this.saveStation}></StationBuilder>
				)}
			</div>
		);
	}
}
