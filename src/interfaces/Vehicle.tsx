export default interface Vehicle {
	id: number;
	name: string;
	children: VehicleChild[];
}

export interface VehicleChild {
	id: number;
	sequence: number;
	doors: VehicleDoor[];
}

export interface VehicleDoor {
	id: number;
	sequence: number;
}
