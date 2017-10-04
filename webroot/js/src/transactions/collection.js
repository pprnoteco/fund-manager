/*
 |------------------------------------------------------------------------
 | App\Transactions: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Transactions.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Transactions.Collection = Collection;
    
}(App));
