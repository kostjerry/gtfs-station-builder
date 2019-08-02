export default interface PathwayInterface {
    pathway_id: number;
    from_stop_id: number;
    to_stop_id: number;
    pathway_mode: PathwayMode;
    is_bidirectional: boolean;
    length?: number | null;
    traversal_time?: number | null;
    stair_count?: number | null;
    max_slope?: number | null;
    min_width?: number | null;
    signposted_as?: string | null;
    reversed_signposted_as?: string | null;
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

export const PathwayModeColor = {
    1: "#000000",
    2: "#6898ee",
    3: "#888888",
    4: "#7ecb7d",
    5: "#f38e1a",
    6: "#9772c4",
    7: "#f2565c"
}
