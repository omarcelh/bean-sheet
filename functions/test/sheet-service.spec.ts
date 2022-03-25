import { SheetService } from './../src/sheet-service';

describe('SheetService', () => {
    describe('compareRows', () => {
        it('should return true for matching rows', () => {
            const rows1 = [['', '', '', '', 'Expenses:Financial:Fees', '4', '', 'USD']];
            const rows2 = [['', '', '', '', 'Expenses:Financial:Fees', '4', '', 'USD']];

            expect(SheetService.compareRows(rows1, rows2)).toStrictEqual([true]);
        });

        it('should return false for matching rows', () => {
            const rows1 = [['', '', '', '', 'Expenses:Financial:Fees', '4', '', 'USD']];
            const rows2 = [['', '', '', '', 'Expenses:Financial:Fees', '', '4', 'USD']];

            expect(SheetService.compareRows(rows1, rows2)).toStrictEqual([false]);
        });

        it('should return a mix of booleans for every row', () => {
            const rows1 = [
                ['1', '2015-02-04', 'BANK FEES', 'Monthly bank fee'],
                ['', '', '', '', 'Expenses:Financial:Fees', '4', '', 'USD'],
            ];
            const rows2 = [
                ['1', '2015-02-04', 'BANK FEES', 'Monthly bank fee'],
                ['', '', '', '', 'Expenses:Financial:Fees', '', '4', 'USD'],
            ];

            expect(SheetService.compareRows(rows1, rows2)).toStrictEqual([true, false]);
        });

        it('should return false for every new row', () => {
            const rows1 = [['1', '2015-02-04', 'BANK FEES', 'Monthly bank fee']];
            const rows2 = [
                ['1', '2015-02-04', 'BANK FEES', 'Monthly bank fee'],
                ['', '', '', '', 'Expenses:Financial:Fees', '4', '', 'USD'],
                ['', '', '', '', 'Expenses:Financial:Fees', '', '4', 'USD'],
                ['', '', '', '', 'Expenses:Financial:Fees', '', '10', 'USD'],
            ];

            expect(SheetService.compareRows(rows1, rows2)).toStrictEqual([true, false, false, false]);
        });
    });
});
