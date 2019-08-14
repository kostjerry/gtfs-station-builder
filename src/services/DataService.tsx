import StopInterface, { LocationTypeColors, LocationTypeMap, WheelchairBoardingMap } from "../interfaces/StopInterface";
import VisNodeInterface from "../interfaces/VisNodeInterface";

export default class DataService {
    static stopUnderscoreToCamel(stopUnderscore: any): StopInterface {
        const stop = {
            stopId: stopUnderscore.stop_id,
            stopName: stopUnderscore.stop_name,
            locationType: stopUnderscore.location_type,
            wheelchairBoarding: stopUnderscore.wheelchair_boarding,
            levelId: stopUnderscore.level_id,
            platformCode: stopUnderscore.platform_code
        }
        return stop;
    }

    static attachStopToNode(stop: StopInterface, node: VisNodeInterface): VisNodeInterface {
        node.label = stop.stopName || "";
        node.color = LocationTypeColors[stop.locationType];
        node.stop = stop;
        return node;
    }

    static prepareNewNode(node: VisNodeInterface): VisNodeInterface {
        node.font = {
            color: "#FFFFFF"
        };
        node.label = "";
        node.color = LocationTypeColors[LocationTypeMap.GenericNode];
        node.stop = {
            stopId: -1,
            stopName: "",
            locationType: LocationTypeMap.GenericNode,
            wheelchairBoarding: WheelchairBoardingMap.NoInfo
        };
        return node;
    }

    
}
