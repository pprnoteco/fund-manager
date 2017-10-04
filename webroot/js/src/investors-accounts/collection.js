/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.InvestorsAccounts.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.InvestorsAccounts.Collection = Collection;
    
}(App));
