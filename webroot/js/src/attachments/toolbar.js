/*
 |------------------------------------------------------------------------
 | App\Attachments: Toolbar
 |------------------------------------------------------------------------
 */

(function(App){

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Toolbar = App.Toolbar.extend({
     
        /*
         |----------------------------------------------------------------
         | Constructor
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            var $elem = this.$el;
            $read = $elem.find('[data-action="read"]');
            $update = $elem.find('[data-action="update"]');
            $delete = $elem.find('[data-action="delete"]');
            $download = $elem.find('[data-action="download"]');
            this.$read = $read;
            this.$delete = $delete;
            this.$update = $update;
            this.$download = $download;
        },
     
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var value = !this.model;
            this.$read.prop('disabled', value);
            this.$update.prop('disabled', value);
            this.$delete.prop('disabled', value);
            this.$download.prop('disabled', value);
        }
        
    });
    
    App.Attachments.Toolbar = Toolbar;
    
}(App));
