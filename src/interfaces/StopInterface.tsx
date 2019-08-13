export default interface StopInterface {
    stop_id: number;
    stop_name?: string | null;
    location_type: number;
    parent_station?: number | null;
    wheelchair_boarding: number;
    level_id?: number | null;
    platform_code?: string | null;
}

export const LocationTypeMap: { [key: string]: number } = {
    "Stop": 0,
    "Station": 1,
    "Entrance": 2,
    "GenericNode": 3,
    "BoardingArea": 4
}

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

export const LocationTypeSort = [
    3, 0, 1, 2, 4
]
