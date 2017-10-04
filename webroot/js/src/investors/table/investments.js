/*
 |------------------------------------------------------------------------
 | App\Investors\Table: Investments
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
        
        emptyMessage: 'No investments found',
        
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
            'offering.rate': function (value) {
                value || (value = 0);
                return value.toFixed(3) + '%';
            },
            date: Table.formats.date,
            amount: Table.formats.currency,
            balance: Table.formats.currency,
        }
        
    });
    
    App.Investors.InvestmentsTable = InvestmentsTable;
    
}(App));
