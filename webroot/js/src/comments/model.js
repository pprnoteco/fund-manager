/*
 |------------------------------------------------------------------------
 | App\Comments: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'comments',
        
        serverNode: 'comments',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function (attrs) {
            if (!attrs.content) {
                return 'Comment cannot be empty';
            }
        }
        
    });
    
    App.Comments.Model = Model;
    
}(App));
