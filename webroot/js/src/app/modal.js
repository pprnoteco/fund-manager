/*
 |------------------------------------------------------------------------
 | App: Modal
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Modal = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Constructor
         |----------------------------------------------------------------
         */
        
        constructor: function (options) {
            View.call(this, options);
            this.addBootstrapEvents();
        },
        
        /*
         |----------------------------------------------------------------
         | Add bootstrap events
         |----------------------------------------------------------------
         */
        
        addBootstrapEvents: function () {
            var self = this;
            this.$el.on('show.bs.modal', function (event) {
                self.trigger('show', event);
            });
            this.$el.on('shown.bs.modal', function (event) {
                self.trigger('shown', event);
            });
            this.$el.on('hide.bs.modal', function (event) {
                self.trigger('hide', event);
            });
            this.$el.on('hidden.bs.modal', function (event) {
                self.trigger('hidden', event);
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Open
         |----------------------------------------------------------------
         */
        
        open: function () {
            $(this.el).modal('show');
        },
        
        /*
         |----------------------------------------------------------------
         | Close
         |----------------------------------------------------------------
         */
        
        close: function () {
            $(this.el).modal('hide');
        },
        
        /*
         |----------------------------------------------------------------
         | Handle update
         |----------------------------------------------------------------
         */
        
        handleUpdate: function () {
            $(this.el).modal('handleUpdate');
        },
        
        /*
         |----------------------------------------------------------------
         | Swap
         |----------------------------------------------------------------
         */
        
        swap: function (modal) {
            this.once('hidden', function () {
                modal.once('shown', function () {
                    modal.handleUpdate();
                });
                modal.open();
            });
            this.close();
        },
        
    });
    
    App.Modal = Modal;
    
}(App));
