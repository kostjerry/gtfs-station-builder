import React, { Component } from 'react';
import './PathwayDialog.scss';
import Pathway from '../interfaces/Pathway';

export interface PathwayDialogProps {
  pathway: Pathway,
  onCancel: Function,
  onApply: Function
}

export interface PathwayDialogState {
  pathwayMode: number;
  isBidirectional: boolean;
  length?: number | null;
  traversalTime?: number | null;
  stairCount?: number | null;
  maxSlope?: number | null;
  minWidth?: number | null;
  signpostedAs?: string | null;
  reversedSignpostedAs?: string | null;
}

export default class PathwayDialog extends Component<PathwayDialogProps, PathwayDialogState> {
  constructor(props: PathwayDialogProps) {
    super(props);
    this.state = {
      pathwayMode: props.pathway.pathwayMode,
      isBidirectional: props.pathway.isBidirectional,
      length: props.pathway.length,
      traversalTime: props.pathway.traversalTime,
      stairCount: props.pathway.stairCount,
      maxSlope: props.pathway.maxSlope,
      minWidth: props.pathway.minWidth,
      signpostedAs: props.pathway.signpostedAs,
      reversedSignpostedAs: props.pathway.reversedSignpostedAs
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
            123
        </div>
        <div className="footer">
          <button onClick={this.handleCancel}>Cancel</button>
          <button onClick={this.handleApply}>Apply</button>
        </div>
      </div>
    );
  }
}
