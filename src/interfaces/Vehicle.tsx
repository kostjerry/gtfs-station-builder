import VehicleDoor from "./VehicleDoor";

export default interface Vehicle {
	vehicleCategoryId: string;
	vehicleCategoryName: string;
	platformIds?: string[];

	children: VehicleChild[];
}

export interface VehicleChild {
	vehicleCategoryId: string;
	childSequence: number;
	
	doors: VehicleDoor[];
}
