import React, { Component } from 'react';
import './StopDialog.scss';
import StopInterface, { LocationTypeMap, WheelchairBoardingMap } from './interfaces/StopInterface';

export interface StopDialogProps {
  stop: StopInterface,
  onCancel: Function,
  onApply: Function
}

export interface StopDialogState {
  stop_name?: string | null,
  location_type: number,
  wheelchair_boarding: number,
  platform_code?: string | null
}

export default class StopDialog extends Component<StopDialogProps, StopDialogState> {
  constructor(props: StopDialogProps) {
    super(props);
    this.state = {
      stop_name: props.stop.stop_name,
      location_type: props.stop.location_type,
      wheelchair_boarding: props.stop.wheelchair_boarding,
      platform_code: props.stop.platform_code
    }
  }

  private handleCancel = () => {
    this.props.onCancel();
  }

  private handleApply = () => {
    this.props.onApply({
      ...this.state
    });
  }

  private handleLocationTypeChange = (event: any) => {
    this.setState({
      location_type: event.target.value
    });
  }

  private handleWheelchairBoardingChange = (event: any) => {
    this.setState({
      wheelchair_boarding: event.target.value
    });
  }

  private handleStopNameChange = (event: any) => {
    this.setState({
      stop_name: event.target.value
    });
  }

  private handlePlatformCodeChange = (event: any) => {
    this.setState({
      platform_code: event.target.value
    });
  }

  render() {
    const locationTypeOptions: any[] = [];
    for (const locationType in LocationTypeMap) {
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
        <div className="header">Add location</div>
        <div className="content">
          <div>
            ID: {this.props.stop.stop_id}
          </div>
          <div>
            Location type: 
            <select value={this.state.location_type} onChange={this.handleLocationTypeChange}>
              {locationTypeOptions}
            </select>
            <div>
              Name: <input type="text" value={this.state.stop_name || ""} onChange={this.handleStopNameChange} />
            </div>
            <div>
              Platform code: <input type="text" value={this.state.platform_code || ""} onChange={this.handlePlatformCodeChange} />
            </div>
            <div>
              Wheelchair boarding: 
              <select value={this.state.wheelchair_boarding} onChange={this.handleWheelchairBoardingChange}>
                {wheelchairBoardingOptions}
              </select>
            </div>
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
