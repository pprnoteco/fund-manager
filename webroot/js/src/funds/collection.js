/*
 |------------------------------------------------------------------------
 | App\Funds: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Funds.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Funds.Collection = Collection;
    
}(App));
