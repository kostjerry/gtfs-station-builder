import StopInterface from "./StopInterface";
import PathwayInterface from "./PathwayInterface";
import LevelInterface from "./LevelInterface";

export default interface CommunicationInterface {
    stops: Array<StopInterface>;
    pathways: Array<PathwayInterface>;
    levels: Array<LevelInterface>;
}
