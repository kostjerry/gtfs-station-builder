import StopInterface, { LocationTypeMap, LocationTypeOnNodeLabelMap } from "../interfaces/StopInterface";

export default class GraphService {
    static getNodeLabel(stop: StopInterface): string {
        let prefix = LocationTypeOnNodeLabelMap[stop.locationType];
        if (stop.locationType === 0) { // Platform
            return stop.platformCode ? prefix + ' "' + stop.platformCode + '"' : prefix;
        }
        else {
            return stop.stopName ? prefix + ' "' + stop.stopName + '"' : prefix;
        }
    }
}