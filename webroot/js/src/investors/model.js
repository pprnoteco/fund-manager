/*
 |------------------------------------------------------------------------
 | App\Investors: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'investors',
        
        serverNode: 'investors',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function () {
            
        }
        
    });
    
    App.Investors.Model = Model;
    
}(App));
