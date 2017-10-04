/*
 |------------------------------------------------------------------------
 | App\Statements: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Statements.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Statements.Collection = Collection;
    
}(App));
