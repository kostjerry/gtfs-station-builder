export default interface Pathway {
    pathwayId: number;
    fromStopId: number;
    toStopId: number;
    pathwayMode: number;
    isBidirectional: boolean;
    length?: number | null;
    traversalTime?: number | null;
    stairCount?: number | null;
    maxSlope?: number | null;
    minWidth?: number | null;
    signpostedAs?: string | null;
    reversedSignpostedAs?: string | null;
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
