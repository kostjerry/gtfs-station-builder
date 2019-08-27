import GTFSStop, { GTFSStopNumericFields } from "../interfaces/GTFSStop";

export default class GTFSService {
    static getDataFromCSV(csv: string, numericFieldsArray: string[]): {}[] {
        const rows: string[] = csv.split("\n");
        let json: {}[] = [];
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
                let jsonRow: {[key: string]: string | number} = {};
                cells.forEach((cell: string, cellIndex: number) => {
                    if (cell !== '') {
                        const fieldName = header[cellIndex];
                        if (numericFieldsArray.includes(fieldName)) {
                            jsonRow[fieldName] = Number(cell);
                        }
                        else {
                            jsonRow[fieldName] = cell;
                        }
                    }
                });
                json.push(jsonRow);
            }
        });
        return json;
    }
}
