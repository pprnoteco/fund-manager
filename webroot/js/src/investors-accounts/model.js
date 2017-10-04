/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'investors-accounts',
        
        serverNode: 'investors-accounts',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function () {
            
        }
        
    });
    
    App.InvestorsAccounts.Model = Model;
    
}(App));
