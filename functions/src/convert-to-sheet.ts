export interface IMeta {
    filename: string;
    lineno: number;
    __tolerances__?: {
        [currency: string]: number;
    };
}
export interface IPosting {
    account: string;
    units: {
        number: number;
        currency: string;
    };
    meta: IMeta;
    [unknownProperty: string | number | symbol]: unknown;
}
export interface ITransaction {
    type: string;
    entry: {
        meta: IMeta;
        date: string;
        flag: string;
        payee: string;
        postings: IPosting[];
        narration: string;
        [unknownProperty: string | number | symbol]: unknown;
    };
    hash: string;
}
export interface ITransactionRow {
    id: string;
    date: string;
    payee: string;
    description: string;
}
export interface IPostingRow {
    account: string;
    debit?: number;
    credit?: number;
    commodity: string;
}
export const SHEET_HEADERS: string[] = [
    'id',
    'date',
    'payee',
    'description',
    'account',
    'debit',
    'credit',
    'commodity',
];

export const beancountToSheets = (
    transactions: ITransaction[],
    overwrite: boolean = false
): (ITransactionRow | IPostingRow)[] => {
    const sortedTransactions = [...transactions].sort((t1, t2) => t1.entry.meta.lineno - t2.entry.meta.lineno);
    let sheets: (ITransactionRow | IPostingRow)[] = [];

    sortedTransactions.forEach((transaction, idx) => {
        sheets.push(transactionToRow((idx + 1).toString(), transaction));
        sheets.push(...transaction.entry.postings.map(postingToRow));
    });

    return sheets;
};

export const transactionToRow = (id: string, transaction: ITransaction): ITransactionRow => {
    return {
        id,
        date: transaction.entry.date,
        payee: transaction.entry.payee,
        description: transaction.entry.narration,
    };
};

export const postingToRow = (posting: IPosting): IPostingRow => {
    if (posting.units.number == 0) {
        console.warn('Debit/credit cannot be equal to 0');
    }

    return {
        account: posting.account,
        ...(posting.units.number > 0 && { debit: posting.units.number }),
        ...(posting.units.number < 0 && { credit: posting.units.number * -1 }),
        commodity: posting.units.currency,
    };
};
