import Stop, { LocationTypeOnNodeLabelMap, LocationTypeColors, WheelchairBoardingMap, LocationTypeMap } from "../interfaces/Stop";
import Pathway, { PathwayModeOnEdgeLabelMap, PathwayModeColors, PathwayModeMap } from "../interfaces/Pathway";
import VisNode from "../interfaces/VisNode";
import VisEdge from "../interfaces/VisEdge";
import wheelchairAccessibleImage from '../images/wheelchair-accessible.png';
import wheelchairNotPossibleImage from '../images/wheelchair-not-possible.png';

// This service defines how to draw things
//   and take care of stop-node and pathway-edge convertion
export default class VisService {
	static newStopId = -1;
	static newPathwayId = -1;

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
		else if (stop.locationType === 2) { // Entrance/Exit
			if (stop.platformCode) {
                label += '\nNumber: "' + stop.platformCode + '"';
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

	static convertStopToNode(stop: Stop, x: number, y: number): VisNode {
        return {
            id: stop.stopId,
            label: VisService.getNodeLabel(stop),
            color: LocationTypeColors[stop.locationType],
            x: x,
            y: y,
            image: stop.wheelchairBoarding === 1 ? wheelchairAccessibleImage : stop.wheelchairBoarding === 2 ? wheelchairNotPossibleImage : "",
            shape: 'circularImage',
            size: 12,
            stop: stop
        }
    }

    static attachStopToNode(stop: Stop, node: VisNode): VisNode {
        if ([3, 4].includes(stop.locationType)) {
            stop.wheelchairBoarding = WheelchairBoardingMap.NoInfo;
        }
        node.label = VisService.getNodeLabel(stop);
        node.color = LocationTypeColors[stop.locationType];
        node.shape = 'circularImage';
        node.size = 12;
        node.image = stop.wheelchairBoarding === 1 ? wheelchairAccessibleImage : stop.wheelchairBoarding === 2 ? wheelchairNotPossibleImage : "";
        node.stop = stop;
        return node;
    }

    static prepareNewNode(node: VisNode): VisNode {
		node.id = this.newStopId;
        node.label = "";
        node.color = LocationTypeColors[LocationTypeMap.GenericNode];
        node.shape = 'circularImage';
        node.size = 12;
        node.stop = {
            stopId: this.newStopId,
            stopName: "",
            locationType: LocationTypeMap.GenericNode,
            wheelchairBoarding: WheelchairBoardingMap.NoInfo,
            platformCode: "",
            signpostedAs: ""
		};
		this.newStopId--;
        return node;
    }

    static convertPathwayToEdge(pathway: Pathway): VisEdge {
        return {
            id: pathway.pathwayId,
            from: pathway.fromStopId,
            to: pathway.toStopId,
            color: {
                color: PathwayModeColors[pathway.pathwayMode],
                highlight: PathwayModeColors[pathway.pathwayMode]
            },
            arrows: {
                from: pathway.isBidirectional,
                to: true
            },
            font: {
                align: 'center'
            },
            label: VisService.getEdgeLabel(pathway),
            pathway: pathway
        };
    }

    static attachPathwayToEdge(pathway: Pathway, edge: VisEdge): VisEdge {
        edge.color.color = PathwayModeColors[pathway.pathwayMode];
        edge.color.highlight = PathwayModeColors[pathway.pathwayMode];
        edge.arrows.from = pathway.isBidirectional;
        edge.label = VisService.getEdgeLabel(pathway);
        edge.pathway = pathway;
        return edge;
    }

    static prepareNewEdge(edge: VisEdge): VisEdge {
		edge.id = this.newPathwayId;
        edge.color = {
            color: PathwayModeColors[PathwayModeMap.Escalator],
            highlight: PathwayModeColors[PathwayModeMap.Escalator]
        }
        edge.arrows = {
            from: true,
            to: true
        };
        edge.font = {
            align: 'center'
        };
        edge.label = '';
        edge.pathway = {
            pathwayId: this.newPathwayId,
            fromStopId: edge.from,
            toStopId: edge.to,
            pathwayMode: PathwayModeMap.Escalator,
            isBidirectional: true,
            length: undefined,
            traversalTime: undefined,
            stairCount: undefined,
            maxSlope: undefined,
            minWidth: undefined,
            signpostedAs: "",
            reversedSignpostedAs: ""
		}
		this.newPathwayId--;
        return edge;
    }
}
