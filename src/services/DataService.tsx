import Stop from "../interfaces/Stop";
import Pathway from "../interfaces/Pathway";
import Level from "../interfaces/Level";
import VehicleBoarding from "../interfaces/VehicleBoarding";
import VehicleCategory from "../interfaces/VehicleCategory";
import VehicleCoupling from "../interfaces/VehicleCoupling";
import VehicleDoor from "../interfaces/VehicleDoor";

/* GTFS to objects conversion and vise versa */
export default class DataService {
    static fromGTFS<T>(data: string, recordFromGTFS: (record: {[key: string]: string}) => T): T[] {
        const rows: string[] = data.split("\n");
        let records: T[] = [];
        let header: string[] = [];
        rows.forEach((row: string) => {
			if (row) {
				const cells = this.csvToArray(row);
				// header
				if (header.length === 0) {
					cells.forEach((cell: string, cellIndex: number) => {
						header[cellIndex] = cell;
					});
				}
				// data
				else {
					let recordGTFS: {[key: string]: string} = {};
					cells.forEach((cell: string, cellIndex: number) => {
						if (cell !== '') {
							const fieldName = header[cellIndex];
							recordGTFS[fieldName] = cell;
						}
					});

					records.push(recordFromGTFS(recordGTFS));
				}
			}
        });
        return records;
    }

    static stopFromGTFS(stop: {[key: string]: string}): Stop {
        return {
			stopId: stop['stop_id'],
			stopLat: stop['stop_lat'] ? Number(stop['stop_lat']) : -1,
			stopLon: stop['stop_lon'] ? Number(stop['stop_lon']) : -1,
			parentStation: stop['parent_station'] || undefined,
            stopName: stop['stop_name'],
            locationType: Number(stop['location_type']),
            wheelchairBoarding: stop['wheelchair_boarding'] !== '' ? Number(stop['wheelchair_boarding']) : 0,
            levelId: stop['level_id'] || undefined,
            platformCode: stop['platform_code'],
			signpostedAs: stop['signposted_as'],
			directionName: stop['direction_name'] || undefined
        };
    }

	static getStopGTFSHeader(): string {
		return	'stop_id,' +
				'stop_lat,' + 
				'stop_lon,' + 
				'stop_name,' +
				'location_type,' +
				'parent_station,' +
				'wheelchair_boarding,' +
				'level_id,' +
				'platform_code,' +
				'signposted_as';
	}

    static stopToGTFS(stop: Stop): string {
		return  stop.stopId + ',' +
				stop.stopLat.toString() + ',' +
				stop.stopLon.toString() + ',' +
				this.escapeText(stop.stopName || '') + ',' +
				stop.locationType.toString() + ',' +
				stop.parentStation + ',' +
                stop.wheelchairBoarding.toString() + ',' +
                stop.levelId + ',' +
                this.escapeText(stop.platformCode || '') + ',' +
                this.escapeText(stop.signpostedAs || '');
    }

    static pathwayFromGTFS(pathway: {[key: string]: string}): Pathway {
        return {
            pathwayId: pathway['pathway_id'],
            fromStopId: pathway['from_stop_id'],
            toStopId: pathway['to_stop_id'],
            pathwayMode: Number(pathway['pathway_mode']),
            isBidirectional: Number(pathway['is_bidirectional']) === 1,
            length: pathway['length'] ? Number(pathway['length']) : undefined,
            traversalTime: pathway['traversal_time'] ? Number(pathway['traversal_time']) : undefined,
            stairCount: pathway['stair_count'] ? Number(pathway['stair_count']) : undefined,
            maxSlope: pathway['max_slope'] ? Number(pathway['max_slope']) : undefined,
            minWidth: pathway['min_width'] ? Number(pathway['min_width']) : undefined,
            signpostedAs: pathway['signposted_as'],
            reversedSignpostedAs: pathway['reversed_signposted_as']
        };
    }

	static getPathwayGTFSHeader(): string {
		return	'pathway_id,' +
				'from_stop_id,' +
				'to_stop_id,' +
				'pathway_mode,' +
				'is_bidirectional,' +
				'length,' +
				'traversal_time,' +
				'stair_count,' +
				'max_slope,' +
				'min_width,' +
				'signposted_as,' +
				'reversed_signposted_as';
	}

    static pathwayToGTFS(pathway: Pathway): string {
        return  pathway.pathwayId + ',' +
                pathway.fromStopId + ',' +
                pathway.toStopId + ',' +
                pathway.pathwayMode.toString() + ',' +
                (pathway.isBidirectional ? '1' : '0') + ',' +
                (pathway.length || '') + ',' +
                (pathway.traversalTime || '') + ',' +
                (pathway.stairCount || '') + ',' +
                (pathway.maxSlope || '') + ',' +
                (pathway.minWidth || '') + ',' +
                this.escapeText(pathway.signpostedAs || '') + ',' +
                this.escapeText(pathway.reversedSignpostedAs || '');
    }

    static levelFromGTFS(level: {[key: string]: string}): Level {
        return {
            levelId: level['level_id'],
            levelName: level['level_name'],
            levelIndex: Number(level['level_index'])
        };
    }

	static getLevelGTFSHeader(): string {
		return	'level_id,' +
				'level_name,' +
				'level_index';
	}

    static levelToGTFS(level: Level): string {
        return  level.levelId + ',' +
				this.escapeText(level.levelName || '') + ',' +
                level.levelIndex.toString();
	}

	static vehicleBoardingFromGTFS(vehicleBoarding: {[key: string]: string}): VehicleBoarding {
        return {
			vehicleCategoryId: vehicleBoarding['vehicle_category_id'],
			childSequence: Number(vehicleBoarding['child_sequence']),
			boardingAreaId: vehicleBoarding['boarding_area_id'],
			doorId: vehicleBoarding['door_id']
        };
	}
	
	static getVehicleBoardingGTFSHeader(): string {
		return	'vehicle_category_id,' +
				'child_sequence,' +
				'boarding_area_id,' +
				'door_id';
	}

    static vehicleBoardingToGTFS(vehicleBoarding: VehicleBoarding): string {
        return  vehicleBoarding.vehicleCategoryId + ',' +
				vehicleBoarding.childSequence.toString() + ',' +
                vehicleBoarding.boardingAreaId + ',' +
                vehicleBoarding.doorId;
	}

	// --------------------------

	static vehicleCategoryFromGTFS(vehicleCategory: {[key: string]: string}): VehicleCategory {
        return {
			vehicleCategoryId: vehicleCategory['vehicle_category_id'],
			vehicleCategoryName: vehicleCategory['vehicle_category_name']
        };
	}

	static vehicleCouplingFromGTFS(vehicleCoupling: {[key: string]: string}): VehicleCoupling {
        return {
			parentId: vehicleCoupling['parent_id'],
			childId: vehicleCoupling['child_id'],
			childSequence: Number(vehicleCoupling['child_sequence'])
        };
	}

	static vehicleDoorFromGTFS(vehicleDoor: {[key: string]: string}): VehicleDoor {
        return {
			doorId: vehicleDoor['door_id'],
			vehicleCategoryId: vehicleDoor['vehicle_category_id'],
			doorSequence: Number(vehicleDoor['door_sequence'])
        };
	}

	// --------------------------

	static getVehicleBoardingId(vehicleBoarding: VehicleBoarding): string {
		return vehicleBoarding.vehicleCategoryId + "+" + vehicleBoarding.childSequence + "+" +
			vehicleBoarding.boardingAreaId + "+" + vehicleBoarding.doorId;
	}

	// TODO
	static escapeText(text: string): string {
		return text;
	}

	// Return array of string values
	// Source: https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
	static csvToArray(text: string) {
		var re_value = /(?!\s*$)\s*(?:"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,\s\\]*(?:\s+[^,\s\\]+)*))\s*(?:,|$)/g;
		var a = [];                     // Initialize array to receive values.
		text.replace(re_value, // "Walk" the string using replace with callback.
			function(m0, m1, m2, m3) {
				// Remove backslash from \' in single quoted values.
				if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
				// Remove backslash from \" in double quoted values.
				else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
				else if (m3 !== undefined) a.push(m3);
				return ''; // Return empty string.
			});
		// Handle special case of empty last value.
		if (/,\s*$/.test(text)) a.push('');
		return a;
	};
}
