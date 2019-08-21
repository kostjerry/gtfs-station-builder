export default interface GTFSStop {
    stop_id: number;
    stop_name?: string;
    location_type: number;
    wheelchair_boarding: number;
    level_id?: number;
    platform_code?: string;
    signposted_as?: string;
}
