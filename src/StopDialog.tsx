import React, { Component } from 'react';
import './StopDialog.scss';
import StopInterface, { LocationTypeMap } from './interfaces/StopInterface';

export interface StopDialogProps {
  stop: StopInterface | null,
  onCancel: Function
}

export interface StopDialogState {
  
}

export default class StopDialog extends Component<StopDialogProps, StopDialogState> {
  private handleCancel = () => {
    this.props.onCancel();
  }

  render() {
    const locationTypes: any[] = [];
    for (const locationType in LocationTypeMap) {
      locationTypes.push(<option key={locationType} value={LocationTypeMap[locationType]}>{locationType}</option>);
    }

    return (
      this.props.stop && <div className="stop-dialog">
        <div className="header">{this.props.stop.stop_name}</div>
        <div className="content">
          <div>
            <select>
              {locationTypes}
            </select>
          </div>
        </div>
        <div className="footer">
          <button onClick={this.handleCancel}>Cancel</button>
          <button>Apply</button>
        </div>
      </div>
    );
  }
}
