import Pathway from "./Pathway";

export default interface VisEdge {
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
    font: {
        align: string
    },
    label: string,
    pathway: Pathway
}
