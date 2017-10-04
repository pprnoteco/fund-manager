/*
 |------------------------------------------------------------------------
 | App\Comments: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Comments.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Comments.Collection = Collection;
    
}(App));
