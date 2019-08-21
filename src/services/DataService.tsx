import Stop, { LocationTypeColors, LocationTypeMap, WheelchairBoardingMap } from "../interfaces/Stop";
import VisNode from "../interfaces/VisNode";
import GraphService from "./GraphService";
import wheelchairAccessibleImage from '../images/wheelchair-accessible.png';
import wheelchairNotPossibleImage from '../images/wheelchair-not-possible.png';
import Pathway, { PathwayModeColors, PathwayModeMap } from "../interfaces/Pathway";
import GTFSStop from "../interfaces/GTFSStop";
import GTFSPathway from "../interfaces/GTFSPathway";
import VisEdge from "../interfaces/VisEdge";

// This service connects GTFS, internal and Vis data types
export default class DataService {
    static convertStopToInternal(gtfsStop: GTFSStop): Stop {
        const stop = {
            stopId: gtfsStop.stop_id,
            stopName: gtfsStop.stop_name,
            locationType: gtfsStop.location_type,
            wheelchairBoarding: gtfsStop.wheelchair_boarding,
            levelId: gtfsStop.level_id,
            platformCode: gtfsStop.platform_code,
            signpostedAs: gtfsStop.signposted_as
        }
        return stop;
    }

    static convertStopToNode(stop: Stop, x: number, y: number): VisNode {
        return {
            id: stop.stopId,
            label: GraphService.getNodeLabel(stop),
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
        node.label = GraphService.getNodeLabel(stop);
        node.color = LocationTypeColors[stop.locationType];
        node.shape = 'circularImage';
        node.size = 12;
        node.image = stop.wheelchairBoarding === 1 ? wheelchairAccessibleImage : stop.wheelchairBoarding === 2 ? wheelchairNotPossibleImage : "";
        node.stop = stop;
        return node;
    }

    static prepareNewNode(node: VisNode): VisNode {
        node.label = "";
        node.color = LocationTypeColors[LocationTypeMap.GenericNode];
        node.shape = 'circularImage';
        node.size = 12;
        node.stop = {
            stopId: -1,
            stopName: "",
            locationType: LocationTypeMap.GenericNode,
            wheelchairBoarding: WheelchairBoardingMap.NoInfo,
            platformCode: "",
            signpostedAs: ""
        };
        return node;
    }

    static convertPathwayToInternal(gtfsPathway: GTFSPathway): Pathway {
        const pathway = {
            pathwayId: gtfsPathway.pathway_id,
            fromStopId: gtfsPathway.from_stop_id,
            toStopId: gtfsPathway.to_stop_id,
            pathwayMode: gtfsPathway.pathway_mode,
            isBidirectional: gtfsPathway.is_bidirectional,
            length: gtfsPathway.length,
            traversalTime: gtfsPathway.traversal_time,
            stairCount: gtfsPathway.stair_count,
            maxSlope: gtfsPathway.max_slope,
            minWidth: gtfsPathway.min_width,
            signpostedAs: gtfsPathway.signposted_as,
            reversedSignpostedAs: gtfsPathway.reversed_signposted_as
        }
        return pathway;
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
            label: GraphService.getEdgeLabel(pathway),
            pathway: pathway
        };
    }

    static attachPathwayToEdge(pathway: Pathway, edge: VisEdge): VisEdge {
        edge.color.color = PathwayModeColors[pathway.pathwayMode];
        edge.color.highlight = PathwayModeColors[pathway.pathwayMode];
        edge.arrows.from = pathway.isBidirectional;
        edge.label = GraphService.getEdgeLabel(pathway);
        edge.pathway = pathway;
        return edge;
    }

    static prepareNewEdge(edge: VisEdge): VisEdge {
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
            pathwayId: -1,
            fromStopId: edge.from,
            toStopId: edge.to,
            pathwayMode: PathwayModeMap.Escalator,
            isBidirectional: true,
            length: null,
            traversalTime: null,
            stairCount: null,
            maxSlope: null,
            minWidth: null,
            signpostedAs: "",
            reversedSignpostedAs: ""
        }
        return edge;
    }
}
