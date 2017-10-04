/*
 |------------------------------------------------------------------------
 | App\Attachments: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'attachments',
        
        serverNode: 'attachments',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Prepare
         |----------------------------------------------------------------
         */
        
        prepare: function () {
            var attrs = this.attributes;
            var formData = new FormData();
            formData.append('parent', attrs.parent);
            formData.append('parent_id', attrs.parent_id);
            formData.append('file', attrs.file);
            return formData;
        },
        
    });
    
    App.Attachments.Model = Model;
    
}(App));
