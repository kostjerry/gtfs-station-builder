export default interface StopInterface {
    stop_id: number;
    stop_name?: string | null;
    location_type: LocationType;
    parent_station?: number | null;
    wheelchair_boarding: WheelchairBoarding;
    level_id?: number | null;
    platform_code?: string | null;
}

export enum LocationType {
    Stop = 0,
    Station = 1,
    Entrance = 2,
    GenericNode = 3,
    BoardingArea = 4
}

export enum WheelchairBoarding {
    NoInfo = 0,
    Accessible = 1,
    NotPossible = 2
}

export const LocationTypeColor = [
    "#6898ee",
    "#333333",
    "#f2565c",
    "#999999",
    "#7ecb7d"
]

export const LocationTypeLevel = {
    1: 0,
    2: 1,
    3: 2,
    0: 3,
    4: 4
}
