export default interface Stop {
	stopId: string;
	stopLat: number,
	stopLon: number,
	layoutLat: number,
	layoutLon: number,
	parentStation?: string,
    stopName?: string;
    locationType: number;
    wheelchairBoarding: number;
    levelId?: string;
    platformCode?: string;
	signpostedAs?: string;

	// Custom props fields
	directionName?: string; // For platforms

	// Custom state fields
	vehiclesInfo?: string;
}

export const LocationTypeMap: { [key: string]: number } = {
    "Platform": 0,
    "Station": 1,
    "Entrance/Exit": 2,
    "GenericNode": 3,
    "BoardingArea": 4
}

export const LocationTypeOnNodeLabelMap = [
    "Platform",
    "Station",
    "E/E",
    "GN",
    "BA"
]

export const WheelchairBoardingMap: { [key: string]: number } = {
    "NoInfo": 0,
    "Accessible": 1,
    "NotPossible": 2
}

export const LocationTypeColors = [
    "#6898ee",
    "#333333",
    "#f2565c",
    "#999999",
    "#7ecb7d"
]
