/*
 |------------------------------------------------------------------------
 | App\Investors: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var InvestorsTable = Table.extend({
        
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
    
    App.Investors.Table = InvestorsTable;
    
}(App));
