export default interface PathwayInterface {
    pathway_id: number;
    from_stop_id: number;
    to_stop_id: number;
    pathway_mode: number;
    is_bidirectional: boolean;
    length?: number | null;
    traversal_time?: number | null;
    stair_count?: number | null;
    max_slope?: number | null;
    min_width?: number | null;
    signposted_as?: string | null;
    reversed_signposted_as?: string | null;
}

export const PathwayModeMap = {
    "Walkway": 1,
    "Stairs": 2,
    "MovingSidewalk": 3,
    "Escalator": 4,
    "Lift": 5,
    "FareGate": 6,
    "ExitGate": 7
}

export const PathwayModeColors = [
    "", // emplty string in 0 index for technical reason
    "#000000", // pathways codes begin from 1
    "#6898ee",
    "#888888",
    "#7ecb7d",
    "#f38e1a",
    "#9772c4",
    "#f2565c"
]
