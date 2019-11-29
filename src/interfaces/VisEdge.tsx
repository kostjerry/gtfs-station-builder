import Pathway from "./Pathway";

export default interface VisEdge {
    id: number,
    from: number,
    to: number,
    color: {
        color: string,
        highlight: string
    },
    arrows: {
        to: boolean,
        from: boolean
	},
	smooth: {
		type: string,
		roundness: number
	},
	label: string,
    pathway: Pathway
}
