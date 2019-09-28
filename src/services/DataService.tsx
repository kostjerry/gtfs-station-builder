import Stop from "../interfaces/Stop";
import Pathway from "../interfaces/Pathway";
import Level from "../interfaces/Level";

/* GTFS to objects conversion and vise versa */
export default class DataService {
    static fromGTFS<T>(data: string, recordFromGTFS: (record: {[key: string]: string}) => T): T[] {
        const rows: string[] = data.split("\n");
        let records: T[] = [];
        let header: string[] = [];
        rows.forEach((row: string) => {
			if (row) {
				const cells = row.split(",");
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
			stopId: Number(stop['stop_id']),
			stopLat: Number(stop['stop_lat']),
			stopLon: Number(stop['stop_lon']),
			parentStation: Number(stop['parent_station']),
            stopName: stop['stop_name'],
            locationType: Number(stop['location_type']),
            wheelchairBoarding: Number(stop['wheelchair_boarding']),
            levelId: Number(stop['level_id']),
            platformCode: stop['platform_code'],
            signpostedAs: stop['signposted_as']
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
		return  stop.stopId.toString() + ',' +
				stop.stopLat.toString() + ',' +
				stop.stopLon.toString() + ',' +
				this.escapeText(stop.stopName || '') + ',' +
				stop.locationType.toString() + ',' +
				(stop.parentStation || '') + ',' +
                stop.wheelchairBoarding.toString() + ',' +
                (stop.levelId || '') + ',' +
                this.escapeText(stop.platformCode || '') + ',' +
                this.escapeText(stop.signpostedAs || '');
    }

    static pathwayFromGTFS(pathway: {[key: string]: string}): Pathway {
        return {
            pathwayId: Number(pathway['pathway_id']),
            fromStopId: Number(pathway['from_stop_id']),
            toStopId: Number(pathway['to_stop_id']),
            pathwayMode: Number(pathway['pathway_mode']),
            isBidirectional: Number(pathway['is_bidirectional']) === 1,
            length: Number(pathway['length']),
            traversalTime: Number(pathway['traversal_time']),
            stairCount: Number(pathway['stair_count']),
            maxSlope: Number(pathway['max_slope']),
            minWidth: Number(pathway['min_width']),
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
        return  pathway.pathwayId.toString() + ',' +
                pathway.fromStopId.toString() + ',' +
                pathway.toStopId.toString() + ',' +
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
            levelId: Number(level['level_id']),
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
        return  level.levelId.toString() + ',' +
				this.escapeText(level.levelName || '') + ',' +
                level.levelIndex.toString();
	}

	// TODO
	static escapeText(text: string): string {
		return text;
	}
}
