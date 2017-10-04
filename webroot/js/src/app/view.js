/*
 |------------------------------------------------------------------------
 | App: View
 |------------------------------------------------------------------------
 */

(function(App, Backbone){
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var View = Backbone.View.extend({
        
        alert: undefined,
        alertElement: undefined,
        _loading: false,
        
        /*
         |----------------------------------------------------------------
         | Constructor
         |----------------------------------------------------------------
         */
        
        constructor: function (options) {
            Backbone.View.call(this, options);
            if (options.alertElement) {
                this.alertElement = options.alertElement;
            }
            this.initAlert();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize alert
         |----------------------------------------------------------------
         */
        
        initAlert: function () {
            var Alert = App.Alert;
            var alert = new Alert({
                el: document.getElementById(this.alertElement)
            });
            this.alert = alert;
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            
        },
    
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            
        },
    
        /*
         |----------------------------------------------------------------
         | Is loading
         |----------------------------------------------------------------
         */
        
        isLoading: function () {
            return !!this._loading;
        },
    
        /*
         |----------------------------------------------------------------
         | Loading (setter)
         |----------------------------------------------------------------
         */
        
        loading: function (state) {
            var prev = this._loading;
            this._loading = !!state;
            if (this._loading) {
                this.loadingStateOn();
            } else {
                this.loadingStateOff();
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
    
        reset: function (model) {
            this.model = model;
            this.render();
        },
        
    });
    
    App.View = View;
    
}(App, Backbone));
