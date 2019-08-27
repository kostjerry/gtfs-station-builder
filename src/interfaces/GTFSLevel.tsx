export default interface GTFSLevel {
    level_id: number;
    level_index: number;
    level_name?: string;
}

export const GTFSLevelNumericFields = [
    'level_id',
    'level_index'
];
