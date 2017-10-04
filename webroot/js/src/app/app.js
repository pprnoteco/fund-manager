/*
 |------------------------------------------------------------------------
 | App.js
 |------------------------------------------------------------------------
 */

(function(root, Backbone){
    
    function Application () {
        
    }
    
    Application.prototype.urlRoot = undefined;
    
    Application.prototype.url = function (path) {
        if (!path) {
            return this.urlRoot;
        }
        return this.urlRoot + path;
    }
    
    var App = new Application();
    
    App.formats = {
        currency: function (value) {
            if (!value || !_.isNumber(value)) return '$ -';
            value = value.toFixed(2).toString();
            value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            return '$ ' + value;
        }
    }
    
    root.App = App;
    
}(window, Backbone));
