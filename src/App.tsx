import React, { Component } from 'react';
import './App.scss';
import Vis from './components/Vis';
import StopDialog from './components/StopDialog';
import StopInterface from './interfaces/StopInterface';
import VisNodeInterface from './interfaces/VisNodeInterface';
import DataService from './services/DataService';

export interface AppProps { }

export interface AppState {
  selectedStop: {
    stop: StopInterface,
    node: VisNodeInterface,
    callback: Function
  } | null
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      selectedStop: null
    };
  }

  private handleStopAdd = (node: VisNodeInterface, callback: Function) => {
    node = DataService.prepareNewNode(node);
    this.setState({
      selectedStop: {
        stop: node.stop,
        node: node,
        callback: callback
      }
    });
  }

  private handleStopEdit = (node: VisNodeInterface, callback: Function) => {
    this.setState({
      selectedStop: {
        stop: node.stop,
        node: node,
        callback: callback
      }
    });
  }

  private handleStopDialogCancel = () => {
    if (this.state.selectedStop) {
      this.state.selectedStop.callback();
      this.setState({
        selectedStop: null
      });
    }
  }

  private handleStopDialogApply = (stop: StopInterface) => {
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
        <Vis onStopAdd={this.handleStopAdd} onStopEdit={this.handleStopEdit}></Vis>
        {this.state.selectedStop && <StopDialog stop={this.state.selectedStop.stop} onCancel={this.handleStopDialogCancel} onApply={this.handleStopDialogApply}></StopDialog>}
      </div>
    );
  }
}
