import React, { Component, RefObject } from "react";
import "./StopDialog.scss";
import Stop, {
	LocationTypeMap,
	WheelchairBoardingMap,
	LocationTypeOnNodeLabelMap
} from "../interfaces/Stop";
import Level from "../interfaces/Level";
import VehicleBoarding from "../interfaces/VehicleBoarding";
import Vehicle from "../interfaces/Vehicle";
import cloneDeep from 'lodash/cloneDeep';

export interface StopDialogProps {
	stop: Stop;
	stations: Stop[];
	platforms: Stop[];
	levels: Level[];
	vehicles: Vehicle[];
	vehicleBoardings: VehicleBoarding[];
	onCancel: () => void;
	onApply: (stop: Stop, vehicleBoardings: VehicleBoarding[]) => void;
}

export interface StopDialogState {
	parentStation: number;
	stopName?: string;
	locationType: number;
	wheelchairBoarding: number;
	platformCode?: string;
	signpostedAs?: string;
	levelId?: number;
	vehicleBoardings: VehicleBoarding[];
}

export default class StopDialog extends Component<StopDialogProps, StopDialogState> {
	private vehicleSelectRef: RefObject<HTMLSelectElement> = React.createRef();

	constructor(props: StopDialogProps) {
		super(props);
		this.state = {
			parentStation: props.stop.parentStation || -1,
			levelId: props.stop.levelId || -1,
			stopName: props.stop.stopName,
			locationType: props.stop.locationType,
			wheelchairBoarding: props.stop.wheelchairBoarding,
			platformCode: props.stop.platformCode,
			signpostedAs: props.stop.signpostedAs,
			vehicleBoardings: cloneDeep(props.vehicleBoardings)
		};
	}

	private handleCancel = () => {
		this.props.onCancel();
	};

	private handleApply = () => {
		// Validate
		if ([0, 1, 2].includes(this.state.locationType) && !this.state.stopName) {
			alert("Selected location type must have a name");
			return;
		}

		this.props.onApply({
			...this.props.stop,
			...this.state
		}, this.state.vehicleBoardings);
	};

	private handleParentStationChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		this.setState({
			parentStation: Number(event.target.value)
		});
	};

	private handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		this.setState({
			levelId: Number(event.target.value)
		});
	}

	private handleLocationTypeChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		let parentStation = -1;
		if (Number(event.target.value) === 3) { // Station for Generic Node
			parentStation = this.props.stations[0].stopId;
		}
		else if (Number(event.target.value) === 4) { // Platform for Boarding Area
			parentStation = this.props.platforms[0].stopId;
		}
		this.setState({
			locationType: Number(event.target.value),
			parentStation
		});
	};

	private handleWheelchairBoardingChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		this.setState({
			wheelchairBoarding: Number(event.target.value)
		});
	};

	private handleStopNameChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		this.setState({
			stopName: event.target.value
		});
	};

	private handlePlatformCodeChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		this.setState({
			platformCode: event.target.value
		});
	};

	private handleSignpostedAsChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		this.setState({
			signpostedAs: event.target.value
		});
	};

	private handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.keyCode === 13) {
			this.handleApply();
		}
	}

	private handleVehicleDeleteClick = (vehicleKey: string) => {
		const index = this.state.vehicleBoardings.findIndex(vehicleBoarding => {
			const key = vehicleBoarding.boardingAreaId + "+" + 
						vehicleBoarding.vehicleCategoryId + "+" + 
						vehicleBoarding.childSequence + "+" + 
						vehicleBoarding.doorId;
			return key === vehicleKey;
		});
		if (index !== -1) {
			this.state.vehicleBoardings.splice(index, 1);
			this.forceUpdate();
		}
	}

	private handleVehicleAddClick = () => {
		if (this.vehicleSelectRef.current) {
			const selectedVehicleKey = this.vehicleSelectRef.current.value;


			const selectedVehicleProps = selectedVehicleKey.split("+").map(prop => Number(prop));
			const boardingAreaId = selectedVehicleProps[0];
			const childSequence = selectedVehicleProps[1];
			const doorSequence = selectedVehicleProps[2];
			this.props.vehicles
				.filter(vehicle => {
					if (vehicle.platformIds) {
						if (vehicle.platformIds.includes(this.state.parentStation)) {
							return true;
						}
						else {
							return false;
						}
					}
					else {
						return true;
					}
				}).forEach(vehicle => {
					const child = vehicle.children.find(child => child.childSequence === childSequence);
					if (child) {
						const door = child.doors.find(door => door.doorSequence === doorSequence);
						if (door) {
							const curKey = boardingAreaId + "+" + childSequence + "+" + door.doorId;
							const index = this.state.vehicleBoardings.findIndex(vehicleBoarding => {
								const key = vehicleBoarding.boardingAreaId + "+" + 
											vehicleBoarding.childSequence + "+" + 
											vehicleBoarding.doorId;
								return key === curKey;
							});
							if (index === -1) {
								this.state.vehicleBoardings.push({
									boardingAreaId,
									vehicleCategoryId: vehicle.vehicleCategoryId,
									childSequence,
									doorId: door.doorId
								});
							}
						}
					}
				});
			this.forceUpdate();
		}
	}

	render() {
		const parentStationOptions: JSX.Element[] = [];
		this.props.stations.forEach(station => {
			parentStationOptions.push(
				<option key={station.stopId} value={station.stopId}>
					{station.stopName}
				</option>
			);
		});

		const parentPlatformOptions: JSX.Element[] = [];
		this.props.platforms.forEach(platform => {
			parentPlatformOptions.push(
				<option key={platform.stopId} value={platform.stopId}>
					{platform.stopId}. {platform.stopName}
				</option>
			);
		});

		const levelOptions: JSX.Element[] = [];
		levelOptions.push(
			<option key={-1} value={-1}>
				None
			</option>
		);
		this.props.levels.forEach(level => {
			levelOptions.push(
				<option key={level.levelId} value={level.levelId}>
					{level.levelIndex} {level.levelName}
				</option>
			);
		});

		const locationTypeOptions: JSX.Element[] = [];
		for (const locationType in LocationTypeMap) {
			if (["Platform", "Station", "Entrance/Exit"].includes(locationType)) {
				continue;
			}
			locationTypeOptions.push(
				<option key={locationType} value={LocationTypeMap[locationType]}>
					{locationType}
				</option>
			);
		}

		const wheelchairBoardingOptions: JSX.Element[] = [];
		for (const wheelchairBoardingKey in WheelchairBoardingMap) {
			wheelchairBoardingOptions.push(
				<option
					key={wheelchairBoardingKey}
					value={WheelchairBoardingMap[wheelchairBoardingKey]}>
					{wheelchairBoardingKey}
				</option>
			);
		}

		const vehiclesToSelect = this.props.vehicles
							.filter(vehicle => {
								if (vehicle.platformIds) {
									if (vehicle.platformIds.includes(this.state.parentStation)) {
										return true;
									}
									else {
										return false;
									}
								}
								else {
									return true;
								}
							});
		const vehicleToSelect: Vehicle | null = vehiclesToSelect ? vehiclesToSelect[0] : null;

		return (
			<div className={"stop-dialog" + ((this.state.locationType === 4) && this.props.vehicles && (this.props.vehicles.length !== 0) ? " extended" : "")} onKeyDown={this.handleKeyDown}>
				<div className="header">Location properties</div>
				<div className="content">
					<div className="left">
						<div>ID: {this.props.stop.stopId}</div>
						<div>
							{(this.state.locationType === 4) ? <div>
								Parent platform:{" "}
								<select
									value={this.state.parentStation}
									onChange={this.handleParentStationChange}>
									{parentPlatformOptions}
								</select>
							</div> : <div>
								Parent station:{" "}
								<select
									value={this.state.parentStation}
									onChange={this.handleParentStationChange}>
									{parentStationOptions}
								</select>
							</div>}
							<div>
								Level:{" "}
								<select
									value={this.state.levelId}
									onChange={this.handleLevelChange}>
									{levelOptions}
								</select>
							</div>
							{[0, 2].includes(this.state.locationType) && (
								<div>
									Location type: {LocationTypeOnNodeLabelMap[this.state.locationType]}
								</div>
							)}
							{[3, 4].includes(this.state.locationType) && (
								<div>
									Location type:{" "}
									<select
										value={this.state.locationType}
										onChange={this.handleLocationTypeChange}>
										{locationTypeOptions}
									</select>
								</div>
							)}
							<div>
								Name:{" "}
								<input
									disabled={![3, 4].includes(this.state.locationType)}
									type="text"
									value={this.state.stopName || ""}
									onChange={this.handleStopNameChange}
								/>
							</div>
							{[0, 2].includes(this.state.locationType) && (
								<div>
									Platform code:{" "}
									<input
										type="text"
										value={this.state.platformCode || ""}
										onChange={this.handlePlatformCodeChange}
									/>
								</div>
							)}
							{[0].includes(this.state.locationType) && (
								<div>
									Signposted as:{" "}
									<input
										type="text"
										value={this.state.signpostedAs || ""}
										onChange={this.handleSignpostedAsChange}
									/>
								</div>
							)}
							{[0, 2].includes(this.state.locationType) && (
								<div>
									Wheelchair boarding:{" "}
									<select
										value={this.state.wheelchairBoarding}
										onChange={this.handleWheelchairBoardingChange}>
										{wheelchairBoardingOptions}
									</select>
								</div>
							)}
						</div>
					</div>
					{(this.state.locationType === 4) && this.props.vehicles && (this.props.vehicles.length !== 0) && 
					<div className="right">
						<table cellPadding="0" cellSpacing="0">
							<tbody>
							<tr className="header">
								<td>Vehicle</td>
								<td>Child</td>
								<td>Door</td>
								<td></td>
							</tr>
							{this.props.vehicles && (this.props.vehicles.length !== 0) && this.state.vehicleBoardings &&
								this.state.vehicleBoardings
								.filter(vehicleBoarding => vehicleBoarding.boardingAreaId === this.props.stop.stopId)
								.map(vehicleBoarding => {
									const key = vehicleBoarding.boardingAreaId + "+" + 
												vehicleBoarding.vehicleCategoryId + "+" + 
												vehicleBoarding.childSequence + "+" + 
												vehicleBoarding.doorId;
									const vehicle = this.props.vehicles.find(vehicle => {
										return vehicle.vehicleCategoryId === vehicleBoarding.vehicleCategoryId;
									});
									if (vehicle) {
										const child = vehicle.children.find(child => child.childSequence === vehicleBoarding.childSequence);
										if (child) {
											const door = child.doors.find(door => vehicleBoarding.doorId === door.doorId);
											if (door) {
												return (<tr key={key}>
													<td>{vehicle.vehicleCategoryName}</td>
													<td>{child.childSequence}</td>
													<td>{door.doorSequence}</td>
													<td>
														<button onClick={() => { this.handleVehicleDeleteClick(key); }}>Delete</button>
													</td>
												</tr>);
											}
										}
									}
									return null;
								})
								.filter(vehicleBoarding => vehicleBoarding !== null)
							}
							<tr>
								<td colSpan={3}>
									<select ref={this.vehicleSelectRef}>
										{vehicleToSelect && vehicleToSelect.children.map(child =>
											child.doors.map(door => {
												const key = this.props.stop.stopId + "+" + child.childSequence + "+" + door.doorSequence;
												return (<option key={key} value={key}>
													{child.childSequence} - {door.doorSequence}
												</option>);
											})
										)}
									</select>
								</td>
								<td>
									<button onClick={this.handleVehicleAddClick}>Add</button>
								</td>
							</tr>
							</tbody>
						</table>
					</div>}
				</div>
				<div className="footer">
					<button onClick={this.handleCancel}>Cancel</button>
					<button onClick={this.handleApply}>Apply</button>
				</div>
			</div>
		);
	}
}
