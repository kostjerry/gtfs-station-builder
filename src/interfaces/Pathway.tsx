export default interface Pathway {
    pathwayId: string;
    fromStopId: string;
    toStopId: string;
    pathwayMode: number;
    isBidirectional: boolean;
    length?: number;
    traversalTime?: number;
    stairCount?: number;
    maxSlope?: number;
    minWidth?: number;
    signpostedAs?: string;
    reversedSignpostedAs?: string;
}

export const PathwayModeMap: { [key: string]: number } = {
    "Walkway": 1,
    "Stairs": 2,
    "MovingSidewalk": 3,
    "Escalator": 4,
    "Lift": 5,
    "FareGate": 6,
    "ExitGate": 7
}

export const PathwayModeOnEdgeLabelMap = [
    "",
    "Walkway", // pathway modes begin from 1
    "Stairs",
    "MovingSidewalk",
    "Escalator",
    "Lift",
    "FareGate",
    "ExitGate"
]

export const PathwayModeColors = [
    "",
    "#000000", // pathway modes begin from 1
    "#6898ee",
    "#888888",
    "#7ecb7d",
    "#f38e1a",
    "#9772c4",
    "#f2565c"
]
