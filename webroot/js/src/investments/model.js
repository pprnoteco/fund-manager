/*
 |------------------------------------------------------------------------
 | App\Investments: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'investments',
        
        serverNode: 'investments',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function (attrs) {
            if (!attrs.account_id) {
                return 'Please select an account';
            }
            if (!attrs.offering_id) {
                return 'Please select an offering';
            }
            if (!attrs.date) {
                return 'Please provide a date';
            }
            if (!attrs.amount) {
                return 'Please provide an amount';
            }
            if (!attrs.term || attrs.term < 1) {
                return 'Please provide a term';
            }
        }
        
    });
    
    App.Investments.Model = Model;
    
}(App));
