/*
 |------------------------------------------------------------------------
 | App\Investors: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Investors.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Investors.Collection = Collection;
    
}(App));
