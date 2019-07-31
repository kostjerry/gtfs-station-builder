export default interface PathwayInterface {
    pathway_id: number;
    from_stop_id: number;
    to_stop_id: number;
    pathway_mode: PathwayMode;
    is_bidirectional: boolean;
    length?: number;
    traversal_time?: number;
    stair_count?: number;
    max_slope?: number;
    min_width?: number;
    signposted_as?: string;
    reversed_signposted_as?: string;
}

export enum PathwayMode {
    Walkway = 1,
    Stairs = 2,
    MovingSidewalk = 3,
    Escalator = 4,
    Lift = 5,
    FareGate = 6,
    ExitGate = 7
}
