/*
 |------------------------------------------------------------------------
 | App\Transactions: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var TransactionsTable = Table.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            type: App.Transactions.typeDescription,
            date: Table.formats.date,
            amount: Table.formats.currency,
            created: Table.formats.date,
            modified: Table.formats.date,
        }
        
    });
    
    App.Transactions.Table = TransactionsTable;
    
}(App));
