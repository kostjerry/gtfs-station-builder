import Stop, { LocationTypeColors, LocationTypeMap, WheelchairBoardingMap } from "../interfaces/Stop";
import VisNode from "../interfaces/VisNode";
import GraphService from "./GraphService";
import wheelchairAccessibleImage from '../images/wheelchair-accessible.png';
import wheelchairNotPossibleImage from '../images/wheelchair-not-possible.png';
import Pathway, { PathwayModeColors, PathwayModeMap } from "../interfaces/Pathway";
import GTFSStop from "../interfaces/GTFSStop";
import GTFSPathway from "../interfaces/GTFSPathway";
import VisEdge from "../interfaces/VisEdge";
import Level from "../interfaces/Level";

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
            isBidirectional: gtfsPathway.is_bidirectional === 1,
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
            length: undefined,
            traversalTime: undefined,
            stairCount: undefined,
            maxSlope: undefined,
            minWidth: undefined,
            signpostedAs: "",
            reversedSignpostedAs: ""
        }
        return edge;
    }


    /* GTFS to objects conversion and vise versa */

    static fromGTFS<T>(data: string, recordFromGTFS: (record: {[key: string]: string}) => T): T[] {
        const rows: string[] = data.split("\n");
        let records: T[] = [];
        let header: string[] = [];
        rows.forEach((row: string) => {
            const cells = row.split(",");
            // header
            if (header.length === 0) {
                cells.forEach((cell: string, cellIndex: number) => {
                    header[cellIndex] = cell;
                });
            }
            // data
            else {
                let recordGTFS: {[key: string]: string} = {};
                cells.forEach((cell: string, cellIndex: number) => {
                    if (cell !== '') {
                        const fieldName = header[cellIndex];
                        recordGTFS[fieldName] = cell;
                    }
                });

                records.push(recordFromGTFS(recordGTFS));
            }
        });
        return records;
    }

    static stopFromGTFS(stop: {[key: string]: string}): Stop {
        return {
            stopId: Number(stop['stop_id']),
            stopName: stop['stop_name'],
            locationType: Number(stop['location_type']),
            wheelchairBoarding: Number(stop['wheelchair_boarding']),
            levelId: Number(stop['level_id']),
            platformCode: stop['platform_code'],
            signpostedAs: stop['signposted_as']
        };
    }

    static stopToGTFS(stop: Stop): string {
        return  stop.stopId + ',' +
                stop.stopName + ',' +
                stop.locationType + ',' +
                stop.wheelchairBoarding + ',' +
                stop.levelId ? '1' : '0' + ',' +
                stop.platformCode + ',' +
                stop.signpostedAs;
    }

    static pathwayFromGTFS(pathway: {[key: string]: string}): Pathway {
        return {
            pathwayId: Number(pathway['pathway_id']),
            fromStopId: Number(pathway['from_stop_id']),
            toStopId: Number(pathway['to_stop_id']),
            pathwayMode: Number(pathway['pathway_mode']),
            isBidirectional: Number(pathway['is_bidirectional']) === 1,
            length: Number(pathway['length']),
            traversalTime: Number(pathway['traversal_time']),
            stairCount: Number(pathway['stair_count']),
            maxSlope: Number(pathway['max_slope']),
            minWidth: Number(pathway['min_width']),
            signpostedAs: pathway['signposted_as'],
            reversedSignpostedAs: pathway['reversed_signposted_as']
        };
    }

    static pathwayToGTFS(pathway: Pathway): string {
        return  pathway.pathwayId + ',' +
                pathway.fromStopId + ',' +
                pathway.toStopId + ',' +
                pathway.pathwayMode + ',' +
                pathway.isBidirectional ? '1' : '0' + ',' +
                pathway.length + ',' +
                pathway.traversalTime + ',' +
                pathway.stairCount + ',' +
                pathway.maxSlope + ',' +
                pathway.minWidth + ',' +
                pathway.signpostedAs + ',' +
                pathway.reversedSignpostedAs;
    }

    static levelFromGTFS(level: {[key: string]: string}): Level {
        return {
            levelId: Number(level['level_id']),
            levelName: level['level_name'],
            levelIndex: Number(level['level_index'])
        };
    }

    static levelToGTFS(level: Level): string {
        return  level.levelId + ',' +
                level.levelName + ',' +
                level.levelIndex;
    }
}
