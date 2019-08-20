import Stop from "./Stop";

export default interface VisNode {
    id: number,
    x?: number,
    y?: number,
    label: string,
    color?: string,
    image: string,
    shape: string,
    size: number,
    stop: Stop
}
