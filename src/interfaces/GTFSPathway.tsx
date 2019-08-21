export default interface GTFSPathway {
    pathway_id: number;
    from_stop_id: number;
    to_stop_id: number;
    pathway_mode: number;
    is_bidirectional: boolean;
    length?: number;
    traversal_time?: number;
    stair_count?: number;
    max_slope?: number;
    min_width?: number;
    signposted_as?: string;
    reversed_signposted_as?: string;
}
