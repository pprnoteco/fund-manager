/*
 |------------------------------------------------------------------------
 | App\Funds: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var FundsTable = Table.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            'investments_amount': Table.formats.currency,
            'investments_balance': Table.formats.currency,
            'created': Table.formats.date,
            'modified': Table.formats.date,
        }
        
    });
    
    App.Funds.Table = FundsTable;
    
}(App));
