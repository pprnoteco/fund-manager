/*
 |------------------------------------------------------------------------
 | App\Statements: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'statements',
        
        serverNode: 'statements',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function () {
            
        }
        
    });
    
    App.Statements.Model = Model;
    
}(App));
