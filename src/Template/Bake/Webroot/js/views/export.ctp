/*
 |------------------------------------------------------------------------
 | App\<%= $modelClass %>\View: Export
 |------------------------------------------------------------------------
 */

(function(App){
    
    var <%= $modelClass %> = App.<%= $modelClass %>;
    var View = <%= $modelClass %>.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ExportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.<%= $modelClass %>.views.ExportView = ExportView;
    
}(App));
