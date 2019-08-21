export default {
    "stops": [
        {
            "stop_id": 1,
            "stop_name": "XYZ",
            "location_type": 1,
            "parent_station": undefined,
            "wheelchair_boarding": 0,
            "level_id": undefined,
            "platform_code": undefined
        },
        {
            "stop_id": 2,
            "stop_name": "1",
            "location_type": 0,
            "parent_station": 1,
            "wheelchair_boarding": 1,
            "level_id": 2,
            "platform_code": "K"
        },
        {
            "stop_id": 3,
            "stop_name": "2",
            "location_type": 0,
            "parent_station": 1,
            "wheelchair_boarding": 1,
            "level_id": undefined,
            "platform_code": undefined
        },
        {
            "stop_id": 4,
            "stop_name": "Center",
            "location_type": 2,
            "parent_station": 1,
            "wheelchair_boarding": 2,
            "level_id": undefined,
            "platform_code": undefined
        },
        {
            "stop_id": 5,
            "stop_name": "Park",
            "location_type": 2,
            "parent_station": 1,
            "wheelchair_boarding": 1,
            "level_id": 1,
            "platform_code": undefined
        }
    ],
    "pathways": [
        {
            "pathway_id": 1,
            "from_stop_id": 4,
            "to_stop_id": 2,
            "pathway_mode": 4,
            "is_bidirectional": true,
            "length": undefined,
            "traversal_time": 60,
            "stair_count": undefined,
            "max_slope": undefined,
            "min_width": undefined,
            "signposted_as": undefined,
            "reversed_signposted_as": undefined
        },
        {
            "pathway_id": 2,
            "from_stop_id": 4,
            "to_stop_id": 2,
            "pathway_mode": 2,
            "is_bidirectional": true,
            "length": undefined,
            "traversal_time": 120,
            "stair_count": undefined,
            "max_slope": undefined,
            "min_width": undefined,
            "signposted_as": undefined,
            "reversed_signposted_as": undefined
        },
        {
            "pathway_id": 3,
            "from_stop_id": 5,
            "to_stop_id": 2,
            "pathway_mode": 5,
            "is_bidirectional": true,
            "length": undefined,
            "traversal_time": 20,
            "stair_count": undefined,
            "max_slope": undefined,
            "min_width": undefined,
            "signposted_as": undefined,
            "reversed_signposted_as": undefined
        },
        {
            "pathway_id": 4,
            "from_stop_id": 2,
            "to_stop_id": 3,
            "pathway_mode": 1,
            "is_bidirectional": true,
            "length": undefined,
            "traversal_time": 30,
            "stair_count": undefined,
            "max_slope": undefined,
            "min_width": undefined,
            "signposted_as": undefined,
            "reversed_signposted_as": undefined
        }
    ],
    "levels": [
        {
            "level_id": 1,
            "level_index": 0,
            "level_name": undefined
        },
        {
            "level_id": 2,
            "level_index": -1,
            "level_name": undefined
        }
    ]
}