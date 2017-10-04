/*
 |------------------------------------------------------------------------
 | App\<?= $modelClass ?>: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.<?= $modelClass ?>.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.<?= $modelClass ?>.Collection = Collection;
    
}(App));
