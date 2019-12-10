import VehicleDoor from "./VehicleDoor";

export default interface Vehicle {
	vehicleCategoryId: number;
	vehicleCategoryName: string;
	boardingAreaIds?: number[];

	children: VehicleChild[];
}

export interface VehicleChild {
	vehicleCategoryId: number;
	childSequence: number;
	
	doors: VehicleDoor[];
}
