export default interface Stop {
	stopId: number;
	stopLat: number,
	stopLon: number,
	parentStation?: number,
    stopName?: string;
    locationType: number;
    wheelchairBoarding: number;
    levelId?: number;
    platformCode?: string;
    signpostedAs?: string;
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
