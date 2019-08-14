import StopInterface from "./StopInterface";

export default interface VisNodeInterface {
    id: number,
    x?: number,
    y?: number,
    label: string,
    color?: string,
    font?: {
        color: string
    },
    stop: StopInterface
}
