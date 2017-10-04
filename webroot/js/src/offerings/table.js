/*
 |------------------------------------------------------------------------
 | App\Offerings: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var OfferingsTable = Table.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            date: Table.formats.date,
            rate: function (value) {
                value || (value = 0);
                return value.toFixed(3) + '%';
            },
            capacity: Table.formats.currency,
            investments_amount: Table.formats.currency,
            investments_balance: Table.formats.currency,
            created: Table.formats.date,
            modified: Table.formats.date,
        }
        
    });
    
    App.Offerings.Table = OfferingsTable;
    
}(App));
