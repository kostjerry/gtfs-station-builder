export default {
    "stops": [
        {
            "stop_id": 1,
            "stop_name": "XYZ",
            "location_type": 1,
            "parent_station": null,
            "wheelchair_boarding": 0,
            "level_id": null,
            "platform_code": null
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
            "level_id": null,
            "platform_code": null
        },
        {
            "stop_id": 4,
            "stop_name": "Center",
            "location_type": 2,
            "parent_station": 1,
            "wheelchair_boarding": 2,
            "level_id": null,
            "platform_code": null
        },
        {
            "stop_id": 5,
            "stop_name": "Park",
            "location_type": 2,
            "parent_station": 1,
            "wheelchair_boarding": 1,
            "level_id": 1,
            "platform_code": null
        }
    ],
    "pathways": [
        {
            "pathway_id": 1,
            "from_stop_id": 4,
            "to_stop_id": 2,
            "pathway_mode": 4,
            "is_bidirectional": true,
            "length": null,
            "traversal_time": 60,
            "stair_count": null,
            "max_slope": null,
            "min_width": null,
            "signposted_as": null,
            "reversed_signposted_as": null
        },
        {
            "pathway_id": 2,
            "from_stop_id": 4,
            "to_stop_id": 2,
            "pathway_mode": 2,
            "is_bidirectional": true,
            "length": null,
            "traversal_time": 120,
            "stair_count": null,
            "max_slope": null,
            "min_width": null,
            "signposted_as": null,
            "reversed_signposted_as": null
        },
        {
            "pathway_id": 2,
            "from_stop_id": 5,
            "to_stop_id": 2,
            "pathway_mode": 5,
            "is_bidirectional": true,
            "length": null,
            "traversal_time": 20,
            "stair_count": null,
            "max_slope": null,
            "min_width": null,
            "signposted_as": null,
            "reversed_signposted_as": null
        },
        {
            "pathway_id": 3,
            "from_stop_id": 2,
            "to_stop_id": 3,
            "pathway_mode": 1,
            "is_bidirectional": true,
            "length": null,
            "traversal_time": 30,
            "stair_count": null,
            "max_slope": null,
            "min_width": null,
            "signposted_as": null,
            "reversed_signposted_as": null
        }
    ],
    "levels": [
        {
            "level_id": 1,
            "level_index": 0,
            "level_name": null
        },
        {
            "level_id": 2,
            "level_index": -1,
            "level_name": null
        }
    ]
}