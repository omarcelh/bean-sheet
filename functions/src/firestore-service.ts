// import { ITransaction } from './convert-to-sheet';
// import * as dayjs from 'dayjs';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export class FirestoreService {
    private db;
    constructor() {
        initializeApp({
            credential: applicationDefault(),
        });

        this.db = getFirestore();
    }

    async batchCreateRows(rowsToUpdate: any[]) {
        const batch = this.db.batch();
        for (const row of rowsToUpdate) {
            const transactionRef = this.db.collection('transactions').doc();
            batch.create(transactionRef, {
                date: new Date(row.entry.date),
                description: row.entry.narration,
                flag: row.entry.flag,
                hash: row.hash,
                links: row.entry.links,
                meta: row.entry.meta,
                payee: row.entry.payee,
                postings: row.entry.postings,
                tags: row.entry.tags,
            });
        }

        await batch.commit();
    }
}

// const fs = new FirestoreService();
// (async () => {
    // const rows = await fs.batchCreateRows();
    // console.log(rows);
// })();
