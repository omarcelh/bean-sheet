import { google } from 'googleapis';
import { isEqual } from 'lodash';

const SERVICE_ACCOUNT_EMAIL: string = process.env.SERVICE_ACCOUNT_EMAIL as string;
const SERVICE_ACCOUNT_PRIVATE_KEY: string = (process.env.SERVICE_ACCOUNT_PRIVATE_KEY as string).replace(/\\n/g, '\n');
const SHEET_ID: string = process.env.SHEET_ID as string;

interface IRowToUpdate {
    index: number;
    values: string[];
}
export class SheetService {
    private sheet = google.sheets('v4');
    private defaultOptions: any;
    private defaultSheet = 'Sheet1';

    constructor() {
        const auth = new google.auth.JWT({
            email: SERVICE_ACCOUNT_EMAIL,
            key: SERVICE_ACCOUNT_PRIVATE_KEY,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        this.defaultOptions = {
            spreadsheetId: SHEET_ID,
            auth,
        };
    }

    async getRows(): Promise<any[][]> {
        return (
            await this.sheet.spreadsheets.values.get({
                ...this.defaultOptions,
                range: `${this.defaultSheet}!A2:H`,
                valueRenderOption: 'UNFORMATTED_VALUE',
            })
        ).data.values || [];
    }

    async updateRows(range: string, values: any[][]): Promise<void> {
        await this.sheet.spreadsheets.values.update({
            ...this.defaultOptions,
            range,
            valueInputOption: 'RAW',
            requestBody: {
                values,
            },
        });
    }

    async batchUpdateRows(rowsToUpdate: IRowToUpdate[]): Promise<void> {
        const data: any[] = rowsToUpdate.map((row) => ({
            range: `${this.defaultSheet}!A${row.index + 2}`,
            values: [row.values],
        }));

        await this.sheet.spreadsheets.values.batchUpdate({
            ...this.defaultOptions,
            requestBody: {
                data,
                valueInputOption: 'RAW',
            },
        });
    }

    async clearRows(): Promise<void> {
        await this.sheet.spreadsheets.values.clear({
            ...this.defaultOptions,
            range: `${this.defaultSheet}!A2:H`,
        });
    }

    static compareRows(rows1: string[][], rows2: string[][]): boolean[] {
        const similarityFlags: boolean[] = new Array(Math.max(rows1.length, rows2.length)).fill(false);
        rows1.forEach((row1, idx) => {
            similarityFlags[idx] = isEqual(row1, rows2[idx]);
        });

        return similarityFlags;
    }
}
