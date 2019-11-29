import React, { Component } from "react";
import "./App.scss";
import StationBuilder from "./components/StationBuilder";
import Communication from "./interfaces/Communication";
import DataService from "./services/DataService";
import JSZip from 'jszip';

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
			let requiredFiles = ["stops.txt", "pathways.txt", "levels.txt"];
			let requiredFilesCount = requiredFiles.length;
			let communicationPacket: Communication = {
				stops: [],
				pathways: [],
				levels: []
			};
			
			// Zip
			if (event.target.files.length === 1) {
				const zipFile = event.target.files[0];
				JSZip.loadAsync(zipFile).then((zip) => {
					zip.forEach((relativePath, file) => {
						requiredFiles.splice(requiredFiles.indexOf(file.name), 1);
						file.async("text").then((fileContent: string) => {
							if (this.extractData(file.name, fileContent, communicationPacket)) {
								requiredFilesCount--;
							}
							if (requiredFilesCount === 0) {
								this.setState({
									data: communicationPacket,
									editMode: true
								});
							}
						});
					});
					if (requiredFiles.length !== 0) {
						alert("Missing files: " + requiredFiles.join(", "));
					}
				}, function (e) {
					console.log(e);
					alert(e.message);
				});
			}
			// Separate files
			else {
				Array.from(event.target.files).forEach((file: File) => {
					requiredFiles.splice(requiredFiles.indexOf(file.name), 1);
					const fileReader = new FileReader();
					fileReader.onload = () => {
						if (this.extractData(file.name, fileReader.result ? fileReader.result.toString() : "", communicationPacket)) {
							requiredFilesCount--;
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
		}
	};

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
		}
		return false;
	}

	private handleStationSave = (data: Communication, deletedStopsIds: number[], deletedPathwaysIds: number[]) => {
		console.log(data, deletedStopsIds, deletedPathwaysIds);
		this.setState({
			editMode: false,
			data: {
				stops: [],
				pathways: [],
				levels: []
			}
		});
	}

	private handleStationCancel = () => {
		this.setState({
			editMode: false,
			data: {
				stops: [],
				pathways: [],
				levels: []
			}
		});
	}

	// private loadSampleData = () => {
	// 	let communicationPacket: Communication = {
	// 		stops: [],
	// 		pathways: [],
	// 		levels: []
	// 	};
	// 	this.extractData("stops.txt",
	// 		`stop_id,stop_lat,stol_lon,stop_name,location_type,parent_station,wheelchair_boarding,level_id,platform_code
	// 		1,,,XYZ,1,,0,,
	// 		2,,,1,0,1,1,2,K
	// 		3,,,2,0,1,1,,
	// 		4,,,Center,2,1,2,,
	// 		5,,,Park,2,1,1,1,`
	// 	, communicationPacket);
	// 	this.extractData("pathways.txt",
	// 		`pathway_id,from_stop_id,to_stop_id,pathway_mode,is_bidirectional,length,traversal_time,stair_count,max_slope,min_width,signposted_as,reversed_signposted_as
	// 		1,4,2,4,1,,60,,,,,
	// 		2,4,2,2,1,,120,,,,,
	// 		21,4,2,2,1,,120,,,,,
	// 		22,4,2,2,1,,120,,,,,
	// 		23,2,4,2,1,,120,,,,,
	// 		24,2,4,2,1,,120,,,,,
	// 		25,2,4,2,1,,120,,,,,
	// 		3,5,2,5,1,,20,,,,,
	// 		4,2,3,1,1,,30,,,,,`
	// 	, communicationPacket);
	// 	this.extractData("levels.txt",
	// 		`level_id,level_index,level_name
	// 		1,0,
	// 		2,-1,`
	// 	, communicationPacket);
	// 	this.setState({
	// 		data: communicationPacket,
	// 		editMode: true
	// 	});
	// }

	render() {
		return (
			<div className="container">
				{!this.state.editMode && (
					<div className="controls">
						<div>
							Select stops.txt, pathways.txt and levels.txt (you can also select a .zip containing those files):
						</div>
						<input
							type="file"
							multiple={true}
							onChange={this.handleFileChange}
						/>
						{/* <br />
						<br />
						<div>OR</div>
						<br />
						<button onClick={this.loadSampleData}>LOAD SAMPLE DATA</button> */}
					</div>
				)}
				{this.state.editMode && (
					<StationBuilder
						data={this.state.data}
						onSave={this.handleStationSave}
						onCancel={this.handleStationCancel}></StationBuilder>
				)}
			</div>
		);
	}
}
