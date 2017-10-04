/*
 |------------------------------------------------------------------------
 | App\Users: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Users.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Users.Collection = Collection;
    
}(App));
