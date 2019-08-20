import GTFSStop from "./GTFSStop";
import GTFSPathway from "./GTFSPathway";
import GTFSLevel from "./GTFSLevel";

export default interface Communication {
    stops: GTFSStop[];
    pathways: GTFSPathway[];
    levels: GTFSLevel[];
}
