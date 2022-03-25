import { transactionToRow, beancountToSheets } from './../src/convert-to-sheet';
import { ITransaction, IPosting, postingToRow } from '../src/convert-to-sheet';

const postings: IPosting[] = [
    {
        account: 'Assets:US:BofA:Checking',
        units: {
            number: -4.0,
            currency: 'USD',
        },
        cost: null,
        price: null,
        flag: null,
        meta: {
            filename: '<string>',
            lineno: 5,
        },
    },
    {
        account: 'Expenses:Financial:Fees',
        units: {
            number: 4.0,
            currency: 'USD',
        },
        cost: null,
        price: null,
        flag: null,
        meta: {
            filename: '<string>',
            lineno: 6,
        },
    },
];
const transaction: ITransaction = {
    type: 'Transaction',
    entry: {
        meta: {
            filename: '<string>',
            lineno: 4,
            __tolerances__: {
                USD: 0.005,
            },
        },
        date: '2015-02-04',
        flag: '*',
        payee: 'BANK FEES',
        narration: 'Monthly bank fee',
        tags: [],
        links: [],
        postings,
    },
    hash: '9b383e9b42e14113bb102ea277c2526d',
};

describe('convert-to-sheet', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('beancountToSheets', () => {
        it('should convert entire beancount text to a sheet', () => {
            expect(beancountToSheets([transaction])).toMatchObject([
                [
                    '1',
                    '2015-02-04',
                    'BANK FEES',
                    'Monthly bank fee',
                ],
                [
                    '',
                    '',
                    '',
                    '',
                    'Assets:US:BofA:Checking',
                    '',
                    '4',
                    'USD',
                ],
                [
                    '',
                    '',
                    '',
                    '',
                    'Expenses:Financial:Fees',
                    '4',
                    '',
                    'USD',
                ],
            ]);
        });
    });

    describe('transactionToRow', () => {
        it('should convert a transaction to a sheet row', () => {
            expect(transactionToRow('1', transaction)).toStrictEqual([
                '1',
                '2015-02-04',
                'BANK FEES',
                'Monthly bank fee',
            ]);
        });
    });

    describe('postingToRow', () => {
        it('should convert a posting to a sheet row with credit field', () => {
            expect(postingToRow(postings[0])).toStrictEqual([
                '',
                '',
                '',
                '',
                'Assets:US:BofA:Checking',
                '',
                '4',
                'USD',
            ]);
        });

        it('should convert a posting to a sheet row with debit field', () => {
            expect(postingToRow(postings[1])).toStrictEqual([
                '',
                '',
                '',
                '',
                'Expenses:Financial:Fees',
                '4',
                '',
                'USD',
            ]);
        });

        it('should convert a posting to a sheet row with a warning', () => {
            const postingWith0 = { ...postings[0], units: { number: 0, currency: 'USD' } };
            jest.spyOn(global.console, 'warn');

            expect(postingToRow(postingWith0)).toStrictEqual([
                '',
                '',
                '',
                '',
                'Assets:US:BofA:Checking',
                '',
                '',
                'USD',
            ]);
            expect(console.warn).toBeCalledWith('Debit/credit cannot be equal to 0');
        });
    });
});
