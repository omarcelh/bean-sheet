
// import { ITransaction } from './convert-to-sheet';
// import * as dayjs from 'dayjs';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { ITransaction, IMeta } from './convert-to-sheet';

export class FirestoreService {
    private db;
    constructor() {
        initializeApp({
            credential: applicationDefault(),
        });

        this.db = getFirestore();
    }

    metaTransformer = {
        to: (doc: any): IMeta => ({
            filename: doc.filename,
            lineno: doc.lineno,
            __tolerances__: doc._tolerances_,
        }),
        from: (doc: IMeta): any => ({
            filename: doc.filename,
            lineno: doc.lineno,
            _tolerances_: doc.__tolerances__,
        }),
    };

    async getAllRows(): Promise<ITransaction[]> {
        try {
            const res = await this.db.collection('transactions').get();
            return res.docs.map((doc: any) => {
                const data: any = doc.data();
                return {
                    ...data,
                    meta: this.metaTransformer.to(data.meta),
                } as ITransaction;
            });
        } catch (err) {
            throw err;
        }
    }

    async batchCreateRows(rowsToUpdate: ITransaction[]) {
        const batch = this.db.batch();
        for (const row of rowsToUpdate) {
            const transactionRef = this.db.collection('transactions').doc();
            batch.create(transactionRef, {
                date: new Date(row.entry.date),
                description: row.entry.narration,
                flag: row.entry.flag,
                hash: row.hash,
                links: row.entry.links,
                meta: this.metaTransformer.from(row.entry.meta),
                payee: row.entry.payee,
                postings: row.entry.postings,
                tags: row.entry.tags,
            });
        }

        try {
            await batch.commit();
        } catch (err) {
            throw err;
        }
    }
}

const fs = new FirestoreService();
(async () => {
    // const doc1 = {
    //     type: 'Transaction',
    //     entry: {
    //         meta: {
    //             filename: '<string>',
    //             lineno: 8,
    //             __tolerances__: {
    //                 USD: 0.005,
    //             },
    //         },
    //         date: '2015-02-06',
    //         flag: '*',
    //         payee: 'RiverBank Properties',
    //         narration: 'Paying the rent',
    //         tags: [],
    //         links: [],
    //         postings: [
    //             {
    //                 account: 'Assets:US:BofA:Checking',
    //                 units: {
    //                     number: -3600.0,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 9,
    //                 },
    //             },
    //             {
    //                 account: 'Expenses:Home:Rent',
    //                 units: {
    //                     number: 3600.0,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 10,
    //                 },
    //             },
    //         ],
    //     },
    //     hash: '52c3e558cf1e69dd90ce74a4f98cc979',
    // };
    // const doc2 = {
    //     type: 'Transaction',
    //     entry: {
    //         meta: {
    //             filename: '<string>',
    //             lineno: 12,
    //             __tolerances__: {
    //                 USD: 0.005,
    //                 IRAUSD: 0.005,
    //             },
    //         },
    //         date: '2015-01-01',
    //         flag: '*',
    //         payee: 'Hoogle',
    //         narration: 'Payroll',
    //         tags: [],
    //         links: [],
    //         postings: [
    //             {
    //                 account: 'Assets:US:BofA:Checking',
    //                 units: {
    //                     number: 1350.6,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 13,
    //                 },
    //             },
    //             {
    //                 account: 'Assets:US:Vanguard:Cash',
    //                 units: {
    //                     number: 1200.0,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 14,
    //                 },
    //             },
    //             {
    //                 account: 'Income:US:Hoogle:Salary',
    //                 units: {
    //                     number: -4615.38,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 15,
    //                 },
    //             },
    //             {
    //                 account: 'Income:US:Hoogle:GroupTermLife',
    //                 units: {
    //                     number: -24.32,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 16,
    //                 },
    //             },
    //             {
    //                 account: 'Expenses:Health:Life:GroupTermLife',
    //                 units: {
    //                     number: 24.32,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 17,
    //                 },
    //             },
    //             {
    //                 account: 'Expenses:Health:Dental:Insurance',
    //                 units: {
    //                     number: 2.9,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 18,
    //                 },
    //             },
    //             {
    //                 account: 'Expenses:Health:Medical:Insurance',
    //                 units: {
    //                     number: 27.38,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 19,
    //                 },
    //             },
    //             {
    //                 account: 'Expenses:Health:Vision:Insurance',
    //                 units: {
    //                     number: 42.3,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 20,
    //                 },
    //             },
    //             {
    //                 account: 'Expenses:Taxes:Y2015:US:Medicare',
    //                 units: {
    //                     number: 106.62,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 21,
    //                 },
    //             },
    //             {
    //                 account: 'Expenses:Taxes:Y2015:US:Federal',
    //                 units: {
    //                     number: 1062.92,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 22,
    //                 },
    //             },
    //             {
    //                 account: 'Expenses:Taxes:Y2015:US:State',
    //                 units: {
    //                     number: 365.08,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 23,
    //                 },
    //             },
    //             {
    //                 account: 'Expenses:Taxes:Y2015:US:CityNYC',
    //                 units: {
    //                     number: 174.92,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 24,
    //                 },
    //             },
    //             {
    //                 account: 'Expenses:Taxes:Y2015:US:SDI',
    //                 units: {
    //                     number: 1.12,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 25,
    //                 },
    //             },
    //             {
    //                 account: 'Expenses:Taxes:Y2015:US:SocSec',
    //                 units: {
    //                     number: 281.54,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 26,
    //                 },
    //             },
    //             {
    //                 account: 'Assets:US:Federal:PreTax401k',
    //                 units: {
    //                     number: -1200.0,
    //                     currency: 'IRAUSD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 27,
    //                 },
    //             },
    //             {
    //                 account: 'Expenses:Taxes:Y2015:US:Federal:PreTax401k',
    //                 units: {
    //                     number: 1200.0,
    //                     currency: 'IRAUSD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 28,
    //                 },
    //             },
    //             {
    //                 account: 'Assets:US:Hoogle:Vacation',
    //                 units: {
    //                     number: 5,
    //                     currency: 'VACHR',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 29,
    //                 },
    //             },
    //             {
    //                 account: 'Income:US:Hoogle:Vacation',
    //                 units: {
    //                     number: -5,
    //                     currency: 'VACHR',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 30,
    //                 },
    //             },
    //         ],
    //     },
    //     hash: '55be764f3ba650c043095b7710570a55',
    // };
    // const doc3 = {
    //     type: 'Transaction',
    //     entry: {
    //         meta: {
    //             filename: '<string>',
    //             lineno: 4,
    //             __tolerances__: {
    //                 USD: 0.005,
    //             },
    //         },
    //         date: '2015-02-04',
    //         flag: '*',
    //         payee: 'BANK FEES',
    //         narration: 'Monthly bank fee',
    //         tags: [],
    //         links: [],
    //         postings: [
    //             {
    //                 account: 'Assets:US:BofA:Checking',
    //                 units: {
    //                     number: -4.0,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 5,
    //                 },
    //             },
    //             {
    //                 account: 'Expenses:Financial:Fees',
    //                 units: {
    //                     number: 4.0,
    //                     currency: 'USD',
    //                 },
    //                 cost: null,
    //                 price: null,
    //                 flag: null,
    //                 meta: {
    //                     filename: '<string>',
    //                     lineno: 6,
    //                 },
    //             },
    //         ],
    //     },
    //     hash: '9b383e9b42e14113bb102ea277c2526d',
    // };
    // const arr: ITransaction[] = [doc1, doc2, doc3];
    // const rows = await fs.batchCreateRows(arr);
    // console.log(rows);

    const rows = await fs.getAllRows();
    console.log(rows);
})();

// [empty sheet]
// 1. POST /sync
// 2. Find firestore.transactions
// 3. Insert firestore.transactions
// 4. Update to sheet

// [existing sheet]
// 1. POST /sync
// 2a. Find firestore.transactions.postings
// 2b. For each transaction, deep equal one another
// 3. For every different one, do batch update firestore.transactions
// 4. Update to sheet

