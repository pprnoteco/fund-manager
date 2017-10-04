/*
 |------------------------------------------------------------------------
 | App\Attachments: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Attachments.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Attachments.Collection = Collection;
    
}(App));
