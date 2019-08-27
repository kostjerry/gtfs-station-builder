import React, { Component } from 'react';
import './StationBuilder.scss';
import Vis from './Vis';
import StopDialog from './StopDialog';
import Stop from '../interfaces/Stop';
import VisNode from '../interfaces/VisNode';
import DataService from '../services/DataService';
import Communication from '../interfaces/Communication';
import GTFSStop from '../interfaces/GTFSStop';
import Pathway from '../interfaces/Pathway';
import VisEdge from '../interfaces/VisEdge';
import PathwayDialog from './PathwayDialog';

export interface StationBuilderProps {
  data: Communication
}

export interface StationBuilderState {
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
      selectedStop: null,
      selectedPathway: null
    };
    this.props.data.stops.map((stop: GTFSStop) => {
      if (stop.location_type === 1) {
        this.stationId = stop.stop_id;
      }
    });
    if (this.stationId === -1) {
      throw "No station provided in input data";
    }
  }

  private handleStopAdd = (node: VisNode, callback: (node?: VisNode) => void) => {
    node = DataService.prepareNewNode(node);
    this.setState({
      selectedStop: {
        stop: node.stop,
        node: node,
        callback: callback
      }
    });
  }

  private handleStopEdit = (node: VisNode, callback: (node?: VisNode) => void) => {
    this.setState({
      selectedStop: {
        stop: node.stop,
        node: node,
        callback: callback
      }
    });
  }

  private handleStopDelete = (dataToDelete: { nodes: number[], edges: number[] }, callback: (dataToDelete?: { nodes: number[], edges: number[] }) => void) => {
    const nodeId = dataToDelete.nodes[0];
    if (this.stationId === nodeId) {
      alert("It's disallowed to delete a station");
      callback();
    }
    else {
      callback(dataToDelete);
    }
  }

  private handleStopDialogCancel = () => {
    if (this.state.selectedStop) {
      this.state.selectedStop.callback();
      this.setState({
        selectedStop: null
      });
    }
  }

  private handleStopDialogApply = (stop: Stop) => {
    if (this.state.selectedStop) {
      const node = DataService.attachStopToNode(stop, this.state.selectedStop.node);
      this.state.selectedStop.callback(node);
      this.setState({
        selectedStop: null
      });
    }
  }

  private handlePathwayAdd = (edge: VisEdge, callback: (edge?: VisEdge) => void) => {
    edge = DataService.prepareNewEdge(edge);
    this.setState({
      selectedPathway: {
        pathway: edge.pathway,
        edge: edge,
        callback: callback
      }
    });
  }

  private handlePathwayEdit = (edge: VisEdge, callback: (edge?: VisEdge) => void) => {
    this.setState({
      selectedPathway: {
        pathway: edge.pathway,
        edge: edge,
        callback: callback
      }
    });
  }

  private handlePathwayDelete = (dataToDelete: { nodes: number[], edges: number[] }, callback: (dataToDelete?: { nodes: number[], edges: number[] }) => void) => {
    callback(dataToDelete);
  }

  private handlePathwayDialogCancel = () => {
    if (this.state.selectedPathway) {
      this.state.selectedPathway.callback();
      this.setState({
        selectedPathway: null
      });
    }
  }

  private handlePathwayDialogApply = (pathway: Pathway) => {
    if (this.state.selectedPathway) {
      const edge = DataService.attachPathwayToEdge(pathway, this.state.selectedPathway.edge);
      this.state.selectedPathway.callback(edge);
      this.setState({
        selectedPathway: null
      });
    }
  }

  render() {
    return (
      <div className="station-builder">
        <Vis
          data={this.props.data}
          onStopAdd={this.handleStopAdd}
          onStopEdit={this.handleStopEdit}
          onStopDelete={this.handleStopDelete}
          onPathwayAdd={this.handlePathwayAdd}
          onPathwayEdit={this.handlePathwayEdit}
          onPathwayDelete={this.handlePathwayDelete}></Vis>

        {this.state.selectedStop && <StopDialog
          stop={this.state.selectedStop.stop}
          onCancel={this.handleStopDialogCancel}
          onApply={this.handleStopDialogApply}></StopDialog>}
        
        {this.state.selectedPathway && <PathwayDialog
          pathway={this.state.selectedPathway.pathway}
          onCancel={this.handlePathwayDialogCancel}
          onApply={this.handlePathwayDialogApply}></PathwayDialog>}
      </div>
    );
  }
}
