import React, { Component } from 'react';
import './App.scss';
import Vis, { VisNode } from './Vis';
import StopDialog from './StopDialog';
import StopInterface, { LocationTypeMap, WheelchairBoardingMap } from './interfaces/StopInterface';

export interface AppProps {}

export interface AppState {
  selectedStop: {
    stop: StopInterface,
    node: VisNode,
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

  private handleStopAdd = (node: VisNode, callback: Function) => {
    this.setState({
      selectedStop: {
        stop: {
          stop_id: -1,
          stop_name: "<new generic node>",
          location_type: LocationTypeMap.GenericNode,
          parent_station: 111,
          wheelchair_boarding: WheelchairBoardingMap.NoInfo
        },
        node: node,
        callback: callback
      }
    });
  }

  private handleStopCancel = () => {
    this.setState({
      selectedStop: null
    });
  }

  private handleStopApply = (stop: StopInterface) => {
    if (this.state.selectedStop) {
      const node = this.state.selectedStop.node;
      node.label = stop.stop_name || "";
      this.setState({
        selectedStop: null
      });
      this.state.selectedStop.callback(node);
    }
  }

  render() {
    return (
      <div className="container">
        <Vis onStopAdd={this.handleStopAdd}></Vis>
        {this.state.selectedStop && <StopDialog stop={this.state.selectedStop.stop} onCancel={this.handleStopCancel} onApply={this.handleStopApply}></StopDialog>}
      </div>
    );
  }
}
