/*
 |------------------------------------------------------------------------
 | App\Offerings: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Offerings.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Offerings.Collection = Collection;
    
}(App));
