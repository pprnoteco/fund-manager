/*
 |------------------------------------------------------------------------
 | App\Accounts: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Accounts.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Accounts.Collection = Collection;
    
}(App));
