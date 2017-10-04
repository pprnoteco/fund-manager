/*
 |------------------------------------------------------------------------
 | App\Offerings\Table: Investments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var InvestmentsTable = Table.extend({
        
        emptyMessage: 'No investments found',
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            balance: Table.formats.currency,
            created: Table.formats.date,
            modified: Table.formats.date,
        }
        
    });
    
    App.Offerings.InvestmentsTable = InvestmentsTable;
    
}(App));
