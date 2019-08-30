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
        });
        return records;
    }

    static stopFromGTFS(stop: {[key: string]: string}): Stop {
        return {
            stopId: Number(stop['stop_id']),
            stopName: stop['stop_name'],
            locationType: Number(stop['location_type']),
            wheelchairBoarding: Number(stop['wheelchair_boarding']),
            levelId: Number(stop['level_id']),
            platformCode: stop['platform_code'],
            signpostedAs: stop['signposted_as']
        };
    }

    static stopToGTFS(stop: Stop): string {
        return  stop.stopId + ',' +
                stop.stopName + ',' +
                stop.locationType + ',' +
                stop.wheelchairBoarding + ',' +
                stop.levelId ? '1' : '0' + ',' +
                stop.platformCode + ',' +
                stop.signpostedAs;
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

    static pathwayToGTFS(pathway: Pathway): string {
        return  pathway.pathwayId + ',' +
                pathway.fromStopId + ',' +
                pathway.toStopId + ',' +
                pathway.pathwayMode + ',' +
                pathway.isBidirectional ? '1' : '0' + ',' +
                pathway.length + ',' +
                pathway.traversalTime + ',' +
                pathway.stairCount + ',' +
                pathway.maxSlope + ',' +
                pathway.minWidth + ',' +
                pathway.signpostedAs + ',' +
                pathway.reversedSignpostedAs;
    }

    static levelFromGTFS(level: {[key: string]: string}): Level {
        return {
            levelId: Number(level['level_id']),
            levelName: level['level_name'],
            levelIndex: Number(level['level_index'])
        };
    }

    static levelToGTFS(level: Level): string {
        return  level.levelId + ',' +
                level.levelName + ',' +
                level.levelIndex;
    }
}
