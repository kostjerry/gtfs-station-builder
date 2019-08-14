import StopInterface, { LocationTypeColors, LocationTypeMap, WheelchairBoardingMap } from "../interfaces/StopInterface";
import VisNodeInterface from "../interfaces/VisNodeInterface";
import GraphService from "./GraphService";
import wheelchairAccessibleImage from '../images/wheelchair-accessible.png';
import wheelchairNotPossibleImage from '../images/wheelchair-not-possible.png';

export default class DataService {
    static stopUnderscoreToCamel(stopUnderscore: any): StopInterface {
        const stop = {
            stopId: stopUnderscore.stop_id,
            stopName: stopUnderscore.stop_name,
            locationType: stopUnderscore.location_type,
            wheelchairBoarding: stopUnderscore.wheelchair_boarding,
            levelId: stopUnderscore.level_id,
            platformCode: stopUnderscore.platform_code,
            signpostedAs: stopUnderscore.signposted_as
        }
        return stop;
    }

    static attachStopToNode(stop: StopInterface, node: VisNodeInterface): VisNodeInterface {
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

    static prepareNewNode(node: VisNodeInterface): VisNodeInterface {
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

    
}
