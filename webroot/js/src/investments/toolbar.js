/*
 |------------------------------------------------------------------------
 | App\Investments: Toolbar
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
            this.$read = $read;
            this.$update = $update;
            this.$delete = $delete;
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
        }
        
    });
    
    App.Investments.Toolbar = Toolbar;
    
}(App));
