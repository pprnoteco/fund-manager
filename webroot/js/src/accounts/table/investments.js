/*
 |------------------------------------------------------------------------
 | App\Accounts\Table: Investments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var InvestmentsTable = Table.extend({
        
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
    
    App.Accounts.InvestmentsTable = InvestmentsTable;
    
}(App));
