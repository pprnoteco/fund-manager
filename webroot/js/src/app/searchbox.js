/*
 |------------------------------------------------------------------------
 | App: Searchbox
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Searchbox = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Value
         |----------------------------------------------------------------
         */
        
        value: function () {
            return this.$el.val();
        },
        
        /*
         |----------------------------------------------------------------
         | Update
         |----------------------------------------------------------------
         */
        
        update: function (value) {
            this.$el.val(value);
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'input': 'search'
        },
        
        /*
         |----------------------------------------------------------------
         | Search
         |----------------------------------------------------------------
         */
        
        search: function () {
            this.trigger('search', this.value());
        },
        
    });
    
    App.Searchbox = Searchbox;
    
}(App));
