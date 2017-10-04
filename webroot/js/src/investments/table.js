/*
 |------------------------------------------------------------------------
 | App\Investments: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var statusTypes = [
        'Pending',
        'Open',
        'Closed'
    ];
    
    var InvestmentsTable = Table.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            status: function (value) {
                value || (value = 1);
                return statusTypes[value];
            },
            fund: function () {
                var offering = this.get('offering');
                var fund = offering.fund;
                return fund.name;
            },
            account: function (account) {
                return account.name;
            },
            date: Table.formats.date,
            amount: Table.formats.currency,
            balance: Table.formats.currency,
            preferred_payment: Table.formats.currency,
            created: Table.formats.date,
            modified: Table.formats.date,
        }
        
    });
    
    App.Investments.Table = InvestmentsTable;
    
}(App));
