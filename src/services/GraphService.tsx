import Stop, { LocationTypeMap, LocationTypeOnNodeLabelMap } from "../interfaces/Stop";

export default class GraphService {
    static getNodeLabel(stop: Stop): string {
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
