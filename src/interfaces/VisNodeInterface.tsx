import StopInterface from "./StopInterface";

export default interface VisNodeInterface {
    id: number,
    x?: number,
    y?: number,
    label: string,
    color?: string,
    image: string,
    shape: string,
    size: number,
    stop: StopInterface
}
