/*
 |------------------------------------------------------------------------
 | App: Profile
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Profile = View.extend({
        
        formats: {},
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            if (!this.model) return;
            this.populate();
        },
        
        /*
         |----------------------------------------------------------------
         | Populate
         |----------------------------------------------------------------
         */
        
        populate: function () {
            var model = this.model;
            var formats = this.formats;
            var field, format, value;
            this.$el.find('[data-field]').each(function () {
                field = this.getAttribute('data-field')
                format = formats[field];
                value = model.get(field);
                if (format) {
                    value = format.call(model, value);
                }
                this.innerHTML = '';
                if (_.isElement(value)) {
                    this.appendChild(value);
                } else {
                    this.innerHTML = value;
                }
            });
        }
        
    });
    
    /*
     |--------------------------------------------------------------------
     | Formats
     |--------------------------------------------------------------------
     */
    
    Profile.formats = {
        date: function (value) {
            if (!value) return 'N/A';
            value = value.toString().replace('T00:00:00+00:00', '');
            return moment(value).format('MM/DD/YYYY');
        },
        currency: function (value) {
            if (!value || !_.isNumber(value)) return '$ -';
            value = value.toFixed(2).toString();
            value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            return '$ ' + value;
        },
        createdBy: function (user) {
            if (!user) return 'Anonymous';
            return user.username.split('@')[0];
        },
        modifiedBy: function (user) {
            if (!user) return 'Anonymous';
            return user.username.split('@')[0];
        }
    };
    
    App.Profile = Profile;
    
}(App));
