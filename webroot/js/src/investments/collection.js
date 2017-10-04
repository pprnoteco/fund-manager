/*
 |------------------------------------------------------------------------
 | App\Investments: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Investments.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Investments.Collection = Collection;
    
}(App));
