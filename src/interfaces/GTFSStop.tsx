export default interface GTFSStop {
    stop_id: number;
    stop_name?: string | null;
    location_type: number;
    wheelchair_boarding: number;
    level_id?: number | null;
    platform_code?: string | null;
    signposted_as?: string | null;
}
