import React, { Component } from 'react';
import './PathwayDialog.scss';
import Pathway from '../interfaces/Pathway';

export interface PathwayDialogProps {
  pathway: Pathway,
  onCancel: Function,
  onApply: Function
}

export interface PathwayDialogState {
  
}

export default class PathwayDialog extends Component<PathwayDialogProps, PathwayDialogState> {
  constructor(props: PathwayDialogProps) {
    super(props);
    this.state = {
      
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

  render() {
    return (
      <div className="pathway-dialog">
        <div className="header">Pathway properties</div>
        <div className="content">
            PATHWAY
        </div>
        <div className="footer">
          <button onClick={this.handleCancel}>Cancel</button>
          <button onClick={this.handleApply}>Apply</button>
        </div>
      </div>
    );
  }
}
