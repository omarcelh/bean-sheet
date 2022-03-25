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

export const beancountToSheets = (transactions: ITransaction[]): string[][] => {
    const sortedTransactions = [...transactions].sort((t1, t2) => t1.entry.meta.lineno - t2.entry.meta.lineno);
    let sheets: string[][] = [];

    sortedTransactions.forEach((transaction, idx) => {
        sheets.push(transactionToRow((idx + 1).toString(), transaction));
        sheets.push(...transaction.entry.postings.map(postingToRow));
    });

    return sheets;
};

export const transactionToRow = (id: string, transaction: ITransaction): string[] => {
    return [id, transaction.entry.date, transaction.entry.payee, transaction.entry.narration];
};

export const postingToRow = (posting: IPosting): string[] => {
    if (posting.units.number == 0) {
        console.warn('Debit/credit cannot be equal to 0');
    }

    return [
        '', // id
        '', // date
        '', // payee
        '', // description
        posting.account,
        posting.units.number > 0 ? posting.units.number.toString() : '',
        posting.units.number < 0 ? (posting.units.number * -1).toString() : '',
        posting.units.currency,
    ];
};
