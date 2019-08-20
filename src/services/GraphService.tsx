import StopInterface, { LocationTypeMap, LocationTypeOnNodeLabelMap } from "../interfaces/StopInterface";

export default class GraphService {
    static getNodeLabel(stop: StopInterface): string {
        let prefix = LocationTypeOnNodeLabelMap[stop.locationType];
        let label =  stop.stopName ? prefix + ' "' + stop.stopName + '"' : prefix;
        if (stop.locationType === 0) { // Platform
            if (stop.platformCode) {
                label += '\nCode: "' + stop.platformCode + '"';
            }
            if (stop.signpostedAs) {
                label += '\nSignposted: "' + stop.signpostedAs + '"';
            }
        }
        return label;
    }
}