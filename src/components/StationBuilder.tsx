import React, { Component } from 'react';
import './StationBuilder.scss';
import Vis from './Vis';
import StopDialog from './StopDialog';
import Stop from '../interfaces/Stop';
import VisNode from '../interfaces/VisNode';
import VisService from '../services/VisService';
import Communication from '../interfaces/Communication';
import Pathway from '../interfaces/Pathway';
import VisEdge from '../interfaces/VisEdge';
import PathwayDialog from './PathwayDialog';
import cloneDeep from 'lodash/cloneDeep';
import DataService from '../services/DataService';
import Level from '../interfaces/Level';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

declare const google: any;

export interface StationBuilderProps {
	data: Communication,
	onSave: (data: Communication) => void,
	mapDiv?: HTMLDivElement,
	map?: google.maps.Map
}

export interface StationBuilderState {
	data: Communication,
	selectedStop: {
		stop: Stop,
		node: VisNode,
		callback: (node?: VisNode) => void
	} | null,
	selectedPathway: {
		pathway: Pathway,
		edge: VisEdge,
		callback: (edge?: VisEdge) => void
	} | null,
	mapMarkers: google.maps.Marker[],
	stations: Stop[]
}

export default class StationBuilder extends Component<StationBuilderProps, StationBuilderState> {
	private mapRef: React.RefObject<HTMLDivElement> = React.createRef();

	constructor(props: StationBuilderProps) {
		super(props);
		let stations: Stop[] = [];
		this.props.data.stops.map((stop: Stop) => {
			if (stop.locationType === 1) {
				stations.push(stop);
			}
			return false;
		});
		if (stations.length === 0) {
			throw new Error("No station provided in input data");
		}
		this.state = {
			data: cloneDeep(props.data),
			selectedStop: null,
			selectedPathway: null,
			mapMarkers: [],
			stations
		};
	}

	public componentDidMount() {
		const bounds = new google.maps.LatLngBounds();
		this.props.data.stops.forEach((stop: Stop) => {
			bounds.extend({
				lat: stop.stopLat,
				lng: stop.stopLon
			});
		});

		let map: google.maps.Map;

		if (this.mapRef.current) {
			if (this.props.mapDiv && this.props.map) {
				this.mapRef.current.appendChild(this.props.mapDiv);
				this.props.map.fitBounds(bounds);
				map = this.props.map;
			}
			else {
				console.log("Google map initialized");
				map = new google.maps.Map(this.mapRef.current);
				map.fitBounds(bounds);
			}
		}

		this.props.data.stops.filter((stop: Stop) => {
			return stop.locationType !== 1;
		}).forEach((stop: Stop) => {
			this.state.mapMarkers.push(new google.maps.Marker({
				map: map,
				position: {
					lat: stop.stopLat,
					lng: stop.stopLon
				}
			}));
		});
	}

	public componentWillUnmount() {
		this.state.mapMarkers.forEach((marker) => {
			marker.setMap(null);
		});
	}

	private handleStopAddMode = (node: VisNode, callback: (node?: VisNode) => void) => {
		node = VisService.prepareNewNode(node, this.state.stations);
		this.setState({
			selectedStop: {
				stop: node.stop,
				node: node,
				callback: callback
			}
		});
	}

	private handleStopEditMode = (node: VisNode, callback: (node?: VisNode) => void) => {
		this.setState({
			selectedStop: {
				stop: node.stop,
				node: node,
				callback: callback
			}
		});
	}

	private handlePathwayAddMode = (edge: VisEdge, callback: (edge?: VisEdge) => void) => {
		edge = VisService.prepareNewEdge(edge);
		this.setState({
			selectedPathway: {
				pathway: edge.pathway,
				edge: edge,
				callback: callback
			}
		});
	}

	private handlePathwayEditMode = (edge: VisEdge, callback: (edge?: VisEdge) => void) => {
		this.setState({
			selectedPathway: {
				pathway: edge.pathway,
				edge: edge,
				callback: callback
			}
		});
	}

	private handleStopDialogApply = (stop: Stop) => {
		if (this.state.selectedStop) {
			const stopIndex = this.state.data.stops.findIndex(curStop => curStop.stopId === stop.stopId);
			if (stopIndex === -1) {
				this.state.data.stops.push(stop);
			}
			else {
				this.state.data.stops[stopIndex] = stop;
			}
			const node = VisService.attachStopToNode(stop, this.state.selectedStop.node);
			this.state.selectedStop.callback(node);
			this.setState({
				selectedStop: null
			});
		}
	}

	private handlePathwayDialogApply = (pathway: Pathway) => {
		if (this.state.selectedPathway) {
			const pathwayIndex = this.state.data.pathways.findIndex(curPathway => curPathway.pathwayId === pathway.pathwayId);
			if (pathwayIndex === -1) {
				this.state.data.pathways.push(pathway);
			}
			else {
				this.state.data.pathways[pathwayIndex] = pathway;
			}
			const edge = VisService.attachPathwayToEdge(pathway, this.state.selectedPathway.edge);
			this.state.selectedPathway.callback(edge);
			this.setState({
				selectedPathway: null
			});
		}
	}

	private handleItemDelete = (
		dataToDelete: { nodes: number[], edges: number[] },
		callback: (dataToDelete?: { nodes: number[], edges: number[] }) => void
	) => {
		dataToDelete.nodes.forEach((nodeId: number) => {
			const stopIndex = this.state.data.stops.findIndex(stop => stop.stopId === nodeId);
			this.state.data.stops.splice(stopIndex, 1);
		});
		dataToDelete.edges.forEach((pathwayId: number) => {
			const pathwayIndex = this.state.data.pathways.findIndex(pathway => pathway.pathwayId === pathwayId);
			this.state.data.pathways.splice(pathwayIndex, 1);
		});
		callback(dataToDelete);
	}

	private handleDialogCancel = () => {
		if (this.state.selectedStop) {
			this.state.selectedStop.callback();
			this.setState({
				selectedStop: null
			});
		}
		if (this.state.selectedPathway) {
			this.state.selectedPathway.callback();
			this.setState({
				selectedPathway: null
			});
		}
	}

	private handleSaveClick = () => {
		this.props.onSave(this.state.data);
	}

	private handleDownloadClick = () => {
		let stopsTxt = DataService.getStopGTFSHeader() + "\n";
		let pathwaysTxt = DataService.getPathwayGTFSHeader() + "\n";
		let levelsTxt = DataService.getLevelGTFSHeader() + "\n";
		this.state.data.stops.forEach((stop: Stop) => {
			stopsTxt += DataService.stopToGTFS(stop) + "\n";
		});
		this.state.data.pathways.forEach((pathway: Pathway) => {
			pathwaysTxt += DataService.pathwayToGTFS(pathway) + "\n";
		});
		this.state.data.levels.forEach((level: Level) => {
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
			<div className="station-builder">
				<div className="panel">
					<button onClick={this.handleSaveClick}>Save</button>
					<button className="download" onClick={this.handleDownloadClick}>Download</button>
				</div>
				<div className="main">
					<div className="graph">
						<Vis
							data={this.state.data}
							onStopAdd={this.handleStopAddMode}
							onStopEdit={this.handleStopEditMode}
							onStopDelete={this.handleItemDelete}
							onPathwayAdd={this.handlePathwayAddMode}
							onPathwayEdit={this.handlePathwayEditMode}
							onPathwayDelete={this.handleItemDelete}></Vis>

						{this.state.selectedStop && <StopDialog
							stop={this.state.selectedStop.stop}
							stations={this.state.stations}
							onCancel={this.handleDialogCancel}
							onApply={this.handleStopDialogApply}></StopDialog>}

						{this.state.selectedPathway && <PathwayDialog
							pathway={this.state.selectedPathway.pathway}
							onCancel={this.handleDialogCancel}
							onApply={this.handlePathwayDialogApply}></PathwayDialog>}
					</div>
					<div className="map" ref={this.mapRef}></div>
				</div>
			</div>
		);
	}
}
