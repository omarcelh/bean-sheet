import { synchronize } from '../src/index';

(async () => {
    const beancountContent: string = `plugin "beancount.plugins.auto"

    2015-02-04 * "BANK FEES" "Monthly bank fee"
      Assets:US:BofA:Checking                           -4.00 USD
      Expenses:Financial:Fees                            4.00 USD
    
    2015-02-06 * "RiverBank Properties" "Paying the rent"
      Assets:US:BofA:Checking                        -3600.00 USD
      Expenses:Home:Rent                              3600.00 USD
    
    2015-01-01 * "Hoogle" "Payroll"
      Assets:US:BofA:Checking                         1350.60 USD
      Assets:US:Vanguard:Cash                         1200.00 USD
      Income:US:Hoogle:Salary                        -4615.38 USD
      Income:US:Hoogle:GroupTermLife                   -24.32 USD
      Expenses:Health:Life:GroupTermLife                24.32 USD
      Expenses:Health:Dental:Insurance                   2.90 USD
      Expenses:Health:Medical:Insurance                 27.38 USD
      Expenses:Health:Vision:Insurance                  42.30 USD
      Expenses:Taxes:Y2015:US:Medicare                 106.62 USD
      Expenses:Taxes:Y2015:US:Federal                 1062.92 USD
      Expenses:Taxes:Y2015:US:State                    365.08 USD
      Expenses:Taxes:Y2015:US:CityNYC                  174.92 USD
      Expenses:Taxes:Y2015:US:SDI                        1.12 USD
      Expenses:Taxes:Y2015:US:SocSec                   281.54 USD
      Assets:US:Federal:PreTax401k                   -1200.00 IRAUSD
      Expenses:Taxes:Y2015:US:Federal:PreTax401k      1200.00 IRAUSD
      Assets:US:Hoogle:Vacation                             5 VACHR
      Income:US:Hoogle:Vacation                            -5 VACHR`;

    await synchronize(beancountContent);
})();
