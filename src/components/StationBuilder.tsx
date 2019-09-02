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

export interface StationBuilderProps {
	data: Communication
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
	} | null
}

export default class StationBuilder extends Component<StationBuilderProps, StationBuilderState> {
	private stationId: number = -1;

	constructor(props: StationBuilderProps) {
		super(props);
		this.state = {
			data: cloneDeep(props.data),
			selectedStop: null,
			selectedPathway: null
		};
		this.props.data.stops.map((stop: Stop) => {
			if (stop.locationType === 1) {
				this.stationId = stop.stopId;
			}
		});
		if (this.stationId === -1) {
			throw "No station provided in input data";
		}
	}

	private handleStopAddMode = (node: VisNode, callback: (node?: VisNode) => void) => {
		node = VisService.prepareNewNode(node);
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
			if (this.stationId === nodeId) {
				alert("It's disallowed to delete a station");
				callback();
			}
			else {
				const stopIndex = this.state.data.stops.findIndex(stop => stop.stopId === nodeId);
				this.state.data.stops.splice(stopIndex, 1);
			}
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
		console.log(this.state.data);
	}

	render() {
		return (
			<div className="station-builder">
				<div className="panel">
					<a onClick={this.handleSaveClick}>Save</a>
				</div>
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
						onCancel={this.handleDialogCancel}
						onApply={this.handleStopDialogApply}></StopDialog>}

					{this.state.selectedPathway && <PathwayDialog
						pathway={this.state.selectedPathway.pathway}
						onCancel={this.handleDialogCancel}
						onApply={this.handlePathwayDialogApply}></PathwayDialog>}
				</div>
			</div>
		);
	}
}
