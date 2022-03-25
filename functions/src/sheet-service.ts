import { config } from 'dotenv';
import { google } from 'googleapis';

config();

const SERVICE_ACCOUNT_EMAIL: string = process.env.SERVICE_ACCOUNT_EMAIL as string;
const SERVICE_ACCOUNT_PRIVATE_KEY: string = (process.env.SERVICE_ACCOUNT_PRIVATE_KEY as string).replace(/\\n/g, '\n');
const SHEET_ID: string = process.env.SHEET_ID as string;

export class SheetService {
    private sheet = google.sheets('v4');
    private defaultOptions;

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

    async getRows(): Promise<any[][] | undefined> {
        return (
            await this.sheet.spreadsheets.values.get({
                ...this.defaultOptions,
                range: 'Sheet1!A2:H',
                valueRenderOption: 'UNFORMATTED_VALUE',
            })
        ).data.values;
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

    async clearRows(): Promise<void> {
        await this.sheet.spreadsheets.values.clear({
            ...this.defaultOptions,
            range: 'Sheet1!A2:H',
        });
    }
}
