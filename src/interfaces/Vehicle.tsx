import VehicleDoor from "./VehicleDoor";

export default interface Vehicle {
	vehicleCategoryId: number;
	vehicleCategoryName: string;
	platformIds?: number[];

	children: VehicleChild[];
}

export interface VehicleChild {
	vehicleCategoryId: number;
	childSequence: number;
	
	doors: VehicleDoor[];
}
