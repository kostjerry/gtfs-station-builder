export default interface GTFSPathway {
	pathway_id: number;
	from_stop_id: number;
	to_stop_id: number;
	pathway_mode: number;
	is_bidirectional: number;
	length?: number;
	traversal_time?: number;
	stair_count?: number;
	max_slope?: number;
	min_width?: number;
	signposted_as?: string;
	reversed_signposted_as?: string;
}

export const GTFSPathwayNumericFields = [
	'pathway_id',
	'from_stop_id',
	'to_stop_id',
	'pathway_mode',
	'is_bidirectional',
	'length',
	'traversal_time',
	'stair_count',
	'max_slope',
	'min_width'
];
