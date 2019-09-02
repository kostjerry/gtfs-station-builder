import React, { Component } from "react";
import "./App.scss";
import StationBuilder from "./components/StationBuilder";
import Communication from "./interfaces/Communication";
import DataService from "./services/DataService";

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
					<StationBuilder data={this.state.data}></StationBuilder>
				)}
			</div>
		);
	}
}
