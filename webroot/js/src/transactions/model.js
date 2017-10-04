/*
 |------------------------------------------------------------------------
 | App\Transactions: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'transactions',
        
        serverNode: 'transactions',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function (attrs) {
            if (!attrs.investment_id) {
                return 'Please select an investment';
            }
            if (!attrs.date) {
                return 'Please provide a date';
            }
            if (!attrs.amount) {
                return 'Please provide an amount';
            }
            if (attrs.type == 3 &&
                attrs.max_amount !== undefined &&
                attrs.max_amount < attrs.amount) {
                return 'A drawdown cannot be greater than the balance';
            }
        }
        
    });
    
    App.Transactions.Model = Model;
    
}(App));
