/*
 |------------------------------------------------------------------------
 | App\Accounts: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var AccountsTable = Table.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            type: function (value) {
                value || (value = 5)
                var types = [
                    null,
                    'Personal',
                    'Business',
                    'IRA',
                    '401K',
                    'Other'
                ];
                return types[value];
            },
            investments_amount: Table.formats.currency,
            investments_balance: Table.formats.currency,
            created: Table.formats.date,
            modified: Table.formats.date,
        }
        
    });
    
    App.Accounts.Table = AccountsTable;
    
}(App));
