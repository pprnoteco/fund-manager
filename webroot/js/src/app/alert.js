/*
 |------------------------------------------------------------------------
 | App: Alert
 |------------------------------------------------------------------------
 */

(function(App){
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Alert = Backbone.View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            options || (options = {});
            this.options = options;
            this.initElement();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function (options) {
            var $message = this.$el.find('[data-element="message"]');
            if ($message.length > 0) {
                this.messageElement = $message[0];
            } else {
                this.messageElement = this.$el[0];
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var message = this.options.message;
            if (message) {
                this.messageElement.innerHTML = message;
                this.show();
            } else {
                this.messageElement.innerHTML = '';
                this.hide();
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Set
         |----------------------------------------------------------------
         */
        
        set: function (message) {
            this.options.message = message;
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Clear
         |----------------------------------------------------------------
         */
        
        clear: function () {
            this.options.message = undefined;
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Show
         |----------------------------------------------------------------
         */
        
        show: function (message) {
            this.$el.removeClass('d-none');
        },
        
        /*
         |----------------------------------------------------------------
         | Hide
         |----------------------------------------------------------------
         */
        
        hide: function () {
            this.$el.addClass('d-none');
        },
        
    });
    
    App.Alert = Alert;
    
}(App));
