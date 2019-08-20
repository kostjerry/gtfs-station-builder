import React, { Component } from 'react';
import './App.scss';
import Vis from './components/Vis';
import StopDialog from './components/StopDialog';
import Stop from './interfaces/Stop';
import VisNode from './interfaces/VisNode';
import DataService from './services/DataService';
import dataSample from './data/data.sample';
import Communication from './interfaces/Communication';
import GTFSStop from './interfaces/GTFSStop';

export interface AppProps { }

export interface AppState {
  selectedStop: {
    stop: Stop,
    node: VisNode,
    callback: Function
  } | null
}

export default class App extends Component<AppProps, AppState> {
  private data: Communication;
  private stationId: number = -1;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      selectedStop: null
    };
    this.data = dataSample;
    this.data.stops.map((stop: GTFSStop) => {
      if (stop.location_type === 1) {
        this.stationId = stop.stop_id;
      }
    });
  }

  private handleStopAdd = (node: VisNode, callback: Function) => {
    node = DataService.prepareNewNode(node);
    this.setState({
      selectedStop: {
        stop: node.stop,
        node: node,
        callback: callback
      }
    });
  }

  private handleStopEdit = (node: VisNode, callback: Function) => {
    this.setState({
      selectedStop: {
        stop: node.stop,
        node: node,
        callback: callback
      }
    });
  }

  private handleStopDelete = (dataToDelete: { nodes: number[], edges: number[] }, callback: Function) => {
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

  render() {
    return (
      <div className="container">
        <Vis data={this.data} onStopAdd={this.handleStopAdd} onStopEdit={this.handleStopEdit} onStopDelete={this.handleStopDelete}></Vis>
        {this.state.selectedStop && <StopDialog stop={this.state.selectedStop.stop} onCancel={this.handleStopDialogCancel} onApply={this.handleStopDialogApply}></StopDialog>}
      </div>
    );
  }
}
