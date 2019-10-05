import React, { Component } from 'react';
import './PathwayDialog.scss';
import Pathway, { PathwayModeMap } from '../interfaces/Pathway';

export interface PathwayDialogProps {
	pathway: Pathway,
	onCancel: () => void,
	onApply: (pathway: Pathway) => void
}

export interface PathwayDialogState {
	pathwayMode: number;
	isBidirectional: boolean;
	length?: string;
	traversalTime?: number;
	stairCount?: number;
	maxSlope?: string;
	minWidth?: string;
	signpostedAs?: string;
	reversedSignpostedAs?: string;
}

export default class PathwayDialog extends Component<PathwayDialogProps, PathwayDialogState> {
	constructor(props: PathwayDialogProps) {
		super(props);
		this.state = {
			pathwayMode: props.pathway.pathwayMode,
			isBidirectional: props.pathway.isBidirectional,
			length: props.pathway.length ? props.pathway.length.toString() : undefined,
			traversalTime: props.pathway.traversalTime,
			stairCount: props.pathway.stairCount,
			maxSlope: props.pathway.maxSlope ? props.pathway.maxSlope.toString() : undefined,
			minWidth: props.pathway.minWidth ? props.pathway.minWidth.toString() : undefined,
			signpostedAs: props.pathway.signpostedAs,
			reversedSignpostedAs: props.pathway.reversedSignpostedAs
		}
	}

	private handleCancel = () => {
		this.props.onCancel();
	}

	private handleApply = () => {
		if (!this.state.traversalTime) {
			alert("Traversal time is required");
			return;
		}
		const length = parseFloat(this.state.length || "");
		const maxSlope = parseFloat(this.state.maxSlope || "");
		const minWidth = parseFloat(this.state.minWidth || "");
		this.props.onApply({
			...this.props.pathway,
			...this.state,
			...{
				length: !isNaN(length) ? length : undefined,
				maxSlope: !isNaN(maxSlope) ? maxSlope : undefined,
				minWidth: !isNaN(minWidth) ? minWidth : undefined
			}
		});
	}

	private handlePathwayModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		this.setState({
			pathwayMode: Number(event.target.value)
		});
	}

	private handleIsBidirectionalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			isBidirectional: event.target.checked
		});
	}

	private handleLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			length: event.target.value.replace(",", ".").replace(/[^\d.]/i, "")
		});
	}

	private handleTraversalTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			traversalTime: parseInt(event.target.value)
		});
	}

	private handleStairCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			stairCount: parseInt(event.target.value)
		});
	}

	private handleMaxSlopeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			maxSlope: event.target.value.replace(",", ".").replace(/[^\d.]/i, "")
		});
	}

	private handleMinWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			minWidth: event.target.value.replace(",", ".").replace(/[^\d.]/i, "")
		});
	}

	private handleSignpostedAsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			signpostedAs: event.target.value
		});
	}

	private handleReversedSignpostedAsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			reversedSignpostedAs: event.target.value
		});
	}

	private handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.keyCode === 13) {
			this.handleApply();
		}
	}

	render() {
		const pathwayModeOptions: JSX.Element[] = [];
		for (const pathwayModeKey in PathwayModeMap) {
			pathwayModeOptions.push(
				<option key={pathwayModeKey} value={PathwayModeMap[pathwayModeKey]}>{pathwayModeKey}</option>
			);
		}

		return (
			<div className="pathway-dialog" onKeyDown={this.handleKeyDown}>
				<div className="header">Pathway properties</div>
				<div className="content">
					<div>
						ID: {this.props.pathway.pathwayId}
					</div>
					<div>
						<div>
							Location type:
              <select value={this.state.pathwayMode} onChange={this.handlePathwayModeChange}>
								{pathwayModeOptions}
							</select>
						</div>
						<div>
							<label>
								Is bidirectional:
                <input type="checkbox" checked={this.state.isBidirectional} onChange={this.handleIsBidirectionalChange} />
							</label>
						</div>
						<div>
							Length: <input type="text" value={this.state.length || ""} onChange={this.handleLengthChange} /> meters
            </div>
						<div>
							Traversal time: <input type="text" value={this.state.traversalTime || ""} onChange={this.handleTraversalTimeChange} /> seconds
            </div>
						<div>
							Stair count: <input type="text" value={this.state.stairCount || ""} onChange={this.handleStairCountChange} />
						</div>
						<div>
							Max slope: <input type="text" value={this.state.maxSlope || ""} onChange={this.handleMaxSlopeChange} />
						</div>
						<div>
							Min width: <input type="text" value={this.state.minWidth || ""} onChange={this.handleMinWidthChange} /> meters
            </div>
						<div>
							Signposted as: <input type="text" value={this.state.signpostedAs || ""} onChange={this.handleSignpostedAsChange} />
						</div>
						<div>
							Reversed signposted as: <input type="text" value={this.state.reversedSignpostedAs || ""} onChange={this.handleReversedSignpostedAsChange} />
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
