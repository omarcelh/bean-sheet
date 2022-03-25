import { config } from 'dotenv';
config();

import * as functions from 'firebase-functions';
import axios from 'axios';
import { beancountToSheets, ITransaction } from './convert-to-sheet';
import { SheetService } from './sheet-service';

interface IResponse {
    status: string;
}
const CONVERTER_URL: string = process.env.CONVERTER_URL as string;
const sheetService: SheetService = new SheetService();

export const syncToSheet: functions.HttpsFunction = functions.https.onRequest(
    async (request: functions.https.Request, response: functions.Response<IResponse>) => {
        functions.logger.info('Starting synchronization', { structuredData: true });
        await synchronize(request.rawBody as any);
        functions.logger.info('Synchronization finished', { structuredData: true });
        response.send({ status: 'OK' });
    }
);

export const synchronize = async (beancountContent: string): Promise<void> => {
    const currentRows: string[][] = (await sheetService.getRows()) as string[][];
    const jsonContent: any = (await axios.post(`${CONVERTER_URL}/converter/bean_to_json`, beancountContent)).data;
    const transactions: ITransaction[] = jsonContent.entries.filter(
        (transaction: any) => transaction.type === 'Transaction'
    ) as ITransaction[];
    const inputRows: string[][] = beancountToSheets(transactions);
    const similarityFlags: boolean[] = SheetService.compareRows(currentRows, inputRows);

    // if every row is different, clear then overwrite whole sheet
    if (similarityFlags.every((x) => x === false)) {
        await sheetService.clearRows();
        await sheetService.updateRows('Sheet1!A2', inputRows);

        return;
    }

    // incremental update for each different row
    let rowsToUpdate = [];
    for (const [index, flag] of similarityFlags.entries()) {
        if (flag === true) {
            continue;
        }

        rowsToUpdate.push({
            index,
            values: inputRows[index],
        });
    }

    await sheetService.batchUpdateRows(rowsToUpdate);
};
