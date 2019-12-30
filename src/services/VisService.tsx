import Stop, { LocationTypeColors, WheelchairBoardingMap, LocationTypeMap } from "../interfaces/Stop";
import Pathway, { PathwayModeOnEdgeLabelMap, PathwayModeColors, PathwayModeMap } from "../interfaces/Pathway";
import VisNode from "../interfaces/VisNode";
import VisEdge from "../interfaces/VisEdge";
import wheelchairAccessibleImage from '../images/wheelchair-accessible.png';
import wheelchairNotPossibleImage from '../images/wheelchair-not-possible.png';

// This service defines how to draw things
//   and take care of stop-node and pathway-edge convertion
export default class VisService {
	public static newStopId = -1;
	public static newPathwayId = -1;
	public static visSize = 1500.0;
	static edgeRoundness: {
		[key: string]: number
	} = {};

	static getEdgeSmoothVariant(from: string, to: string): { type: string, roundness: number } {
		let hash = from + ":" + to + ":" + 1;
		let hashReversedDir = from + ":" + to + ":" + 2;
		if (from > to) {
			hash = to + ":" + from + ":" + 2;
			hashReversedDir = to + ":" + from + ":" + 1;
		}
		if (this.edgeRoundness[hash] === undefined) {
			this.edgeRoundness[hash] = 0.2;
			this.edgeRoundness[hashReversedDir] = 0.0;
		}
		else {
			this.edgeRoundness[hash] += 0.2;
		}
		return {
			type: "curvedCW",
			roundness: this.edgeRoundness[hash]
		}
	}

    static getNodeLabel(stop: Stop): string {
        let prefix = "";
        let label =  stop.stopName ? prefix + stop.stopName + '\n' : prefix;
        if (stop.locationType === 0) { // Platform
			label = prefix + ' #' + stop.stopId + (stop.directionName ? '. ' + stop.directionName : '');
			if (stop.platformCode) {
                label += '\nCode: "' + stop.platformCode + '"';
            }
            if (stop.signpostedAs) {
                label += '\nSignposted: "' + stop.signpostedAs + '"';
			}
		}
		else if (stop.locationType === 2) { // Entrance/Exit
			if (stop.platformCode) {
                label += 'Number: "' + stop.platformCode + '"';
            }
		}
		else if (stop.locationType === 4) { // Boarding Area
			label += 'for #' + stop.parentStation + (stop.directionName ? '. ' + stop.directionName : '');
			if (stop.vehiclesInfo) {
				label += '\n' + stop.vehiclesInfo;
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
		if (pathway.signpostedAs) {
			label += '\nSignposted: "' + pathway.signpostedAs + '"';
		}
        return label;
	}

	static convertStopToNode(stop: Stop): VisNode {
        return {
            id: stop.stopId,
            label: VisService.getNodeLabel(stop),
            color: LocationTypeColors[stop.locationType],
            x: stop.layoutLon,
            y: stop.layoutLat,
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

    static prepareNewNode(node: VisNode, stations: Stop[], coefs:{[key: string]: number}): VisNode {
		node.id = this.newStopId.toString();
        node.label = "";
        node.color = LocationTypeColors[LocationTypeMap.GenericNode];
        node.shape = 'circularImage';
		node.size = 12;
		node.image = "";
        node.stop = {
			stopId: this.newStopId.toString(),
			stopLat: ((node.y || 0) - coefs.latX) / coefs.latK,
			stopLon: ((node.x || 0) - coefs.lonX) / coefs.lonK,
			layoutLat: node.y || 0,
			layoutLon: node.x || 0,
			parentStation: stations[0].stopId,
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
			smooth: this.getEdgeSmoothVariant(pathway.fromStopId, pathway.toStopId),
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
	
	static updatePathwayInEdge(edge: VisEdge): VisEdge {
		edge.pathway.fromStopId = edge.from;
		edge.pathway.toStopId = edge.to;
        return edge;
    }

    static prepareNewEdge(edge: VisEdge): VisEdge {
		edge.id = this.newPathwayId.toString();
        edge.color = {
            color: PathwayModeColors[PathwayModeMap.Stairs],
            highlight: PathwayModeColors[PathwayModeMap.Stairs]
        }
        edge.arrows = {
            from: true,
            to: true
        };
        edge.label = '';
        edge.pathway = {
			pathwayId: this.newPathwayId.toString(),
			traversalTime: 10,
            fromStopId: edge.from,
            toStopId: edge.to,
            pathwayMode: PathwayModeMap.Stairs,
            isBidirectional: true,
            signpostedAs: "",
            reversedSignpostedAs: ""
		}
		edge.smooth = this.getEdgeSmoothVariant(edge.from, edge.to);
		this.newPathwayId--;
        return edge;
    }
}
