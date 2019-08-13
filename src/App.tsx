import React, { Component } from 'react';
import './App.scss';
import Vis, { VisNode } from './Vis';
import StopDialog from './StopDialog';
import StopInterface, { LocationTypeMap, WheelchairBoardingMap } from './interfaces/StopInterface';
import { VisitNode } from '@babel/traverse';

export interface AppProps {}

export interface AppState {
  selectedStop: StopInterface | null
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      selectedStop: null
    };
  }

  private handleStopAdd = (node: VisNode, callback: Function) => {
    console.log(node);
    this.setState({
      selectedStop: {
        stop_id: -1,
        stop_name: "",
        location_type: LocationTypeMap.GenericNode,
        parent_station: 111,
        wheelchair_boarding: WheelchairBoardingMap.NoInfo
      }
    });
    // callback(stop);
  }

  private handleStopCancel = () => {
    this.setState({
      selectedStop: null
    });
  }

  render() {
    return (
      <div className="container">
        <Vis onStopAdd={this.handleStopAdd}></Vis>
        <StopDialog stop={this.state.selectedStop} onCancel={this.handleStopCancel}></StopDialog>
      </div>
    );
  }
}
