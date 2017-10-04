/*
 |------------------------------------------------------------------------
 | App\Offerings: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'offerings',
        
        serverNode: 'offerings',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function () {
            
        }
        
    });
    
    App.Offerings.Model = Model;
    
}(App));
