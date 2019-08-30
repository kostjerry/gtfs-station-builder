import Stop from "./Stop";
import Pathway from "./Pathway";
import Level from "./Level";

export default interface Communication {
	stops?: Stop[];
	pathways?: Pathway[];
	levels?: Level[];
}
