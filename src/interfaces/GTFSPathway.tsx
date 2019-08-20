export default interface GTFSPathway {
    pathway_id: number;
    from_stop_id: number;
    to_stop_id: number;
    pathway_mode: number;
    is_bidirectional: boolean;
    length?: number | null;
    traversal_time?: number | null;
    stair_count?: number | null;
    max_slope?: number | null;
    min_width?: number | null;
    signposted_as?: string | null;
    reversed_signposted_as?: string | null;
}
