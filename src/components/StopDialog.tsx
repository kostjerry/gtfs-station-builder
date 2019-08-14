import React, { Component } from 'react';
import './StopDialog.scss';
import StopInterface, { LocationTypeMap, WheelchairBoardingMap } from '../interfaces/StopInterface';

export interface StopDialogProps {
  stop: StopInterface,
  onCancel: Function,
  onApply: Function
}

export interface StopDialogState {
  stopName?: string | null,
  locationType: number,
  wheelchairBoarding: number,
  platformCode?: string | null,
  signpostedAs?: string | null
}

export default class StopDialog extends Component<StopDialogProps, StopDialogState> {
  constructor(props: StopDialogProps) {
    super(props);
    this.state = {
      stopName: props.stop.stopName,
      locationType: props.stop.locationType,
      wheelchairBoarding: props.stop.wheelchairBoarding,
      platformCode: props.stop.platformCode,
      signpostedAs: props.stop.signpostedAs
    }
  }

  private handleCancel = () => {
    this.props.onCancel();
  }

  private handleApply = () => {
    // Validate
    console.log(this.state);
    if ([0, 1, 2].includes(this.state.locationType) && !this.state.stopName) {
      alert('Selected location type must have a name');
      return;
    }

    this.props.onApply({
      ...this.state
    });
  }

  private handleLocationTypeChange = (event: any) => {
    this.setState({
      locationType: Number(event.target.value)
    });
  }

  private handleWheelchairBoardingChange = (event: any) => {
    this.setState({
      wheelchairBoarding: Number(event.target.value)
    });
  }

  private handleStopNameChange = (event: any) => {
    this.setState({
      stopName: event.target.value
    });
  }

  private handlePlatformCodeChange = (event: any) => {
    this.setState({
      platformCode: event.target.value
    });
  }

  private handleSignpostedAsChange = (event: any) => {
    this.setState({
      signpostedAs: event.target.value
    });
  }

  render() {
    const locationTypeOptions: any[] = [];
    for (const locationType in LocationTypeMap) {
      if (locationType === 'Station') {
        continue;
      }
      locationTypeOptions.push(
        <option key={locationType} value={LocationTypeMap[locationType]}>{locationType}</option>
      );
    }

    const wheelchairBoardingOptions: any[] = [];
    for (const wheelchairBoardingKey in WheelchairBoardingMap) {
      wheelchairBoardingOptions.push(
        <option key={wheelchairBoardingKey} value={WheelchairBoardingMap[wheelchairBoardingKey]}>{wheelchairBoardingKey}</option>
      );
    }

    return (
      <div className="stop-dialog">
        <div className="header">Location properties</div>
        <div className="content">
          <div>
            ID: {this.props.stop.stopId}
          </div>
          <div>
            {[0, 2, 3, 4].includes(this.state.locationType) && <div> 
              Location type: 
              <select value={this.state.locationType} onChange={this.handleLocationTypeChange}>
                {locationTypeOptions}
              </select>
            </div>}
            <div>
              Name: <input type="text" value={this.state.stopName || ""} onChange={this.handleStopNameChange} />
            </div>
            {[0].includes(this.state.locationType) && <div>
              Platform code: <input type="text" value={this.state.platformCode || ""} onChange={this.handlePlatformCodeChange} />
            </div>}
            {[0].includes(this.state.locationType) && <div>
              Signposted as: <input type="text" value={this.state.signpostedAs || ""} onChange={this.handleSignpostedAsChange} />
            </div>}
            {[0, 2].includes(this.state.locationType) && <div>
              Wheelchair boarding: 
              <select value={this.state.wheelchairBoarding} onChange={this.handleWheelchairBoardingChange}>
                {wheelchairBoardingOptions}
              </select>
            </div>}
          </div>
        </div>
        <div className="footer">
          <button onClick={this.handleCancel}>Cancel</button>
          <button onClick={this.handleApply}>Apply</button>
        </div>
      </div>
    );
  }
}
