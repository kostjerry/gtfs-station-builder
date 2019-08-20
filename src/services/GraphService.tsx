import Stop, { LocationTypeMap, LocationTypeOnNodeLabelMap } from "../interfaces/Stop";
import Pathway, { PathwayModeOnEdgeLabelMap } from "../interfaces/Pathway";

// This service defines how to draw things
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

    static getEdgeLabel(pathway: Pathway): string {
        let prefix = PathwayModeOnEdgeLabelMap[pathway.pathwayMode];
        let label = prefix;
        if (pathway.traversalTime) {
            label += '\n' + pathway.traversalTime + ' s'
        }
        return label;
    }
}
