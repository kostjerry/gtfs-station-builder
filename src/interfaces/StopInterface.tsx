export default interface StopInterface {
    stop_id: number;
    stop_name?: string;
    location_type: LocationType;
    parent_station?: number;
    wheelchair_boarding: WheelchairBoarding;
    level_id?: number;
    platform_code?: string;
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
