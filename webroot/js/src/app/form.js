/*
 |------------------------------------------------------------------------
 | App: Form
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Form = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.populate();
        },
        
        /*
         |----------------------------------------------------------------
         | Populate
         |----------------------------------------------------------------
         */

        populate: function () {
            var $elem = this.$el;
            var model = this.model;
            var attr, value, $this;
            if (!model) return;
            $elem.find('[data-field]').each(function (input) {
                attr = this.getAttribute('data-field');
                if (!model.has(attr)) return;
                value = model.get(attr);
                $this = $(this);
                if (this.type == 'date') {
                    if (!value) return;
                    value = value.toString().split('T00:00:00+00:00')[0];
                    value = moment(value).format('YYYY-MM-DD');
                }
                $this.val(value);
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Serialize
         |----------------------------------------------------------------
         */

        toModel: function () {
            var $elem = this.$el;
            var model = this.model;
            if (!model) return;
            $elem.find('[data-field]').each(function (input) {
                var attr = this.getAttribute('data-field');
                var value = $(this).val();
                model.set(attr, value);
            });
            return model;
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var form = this;
            var model = this.toModel();
            if (!model.isValid()) {
                this.trigger('error', model.validationError);
                return;
            }
            this.loading(true);
            model.save(model.attributes, {
                validate: false,
                success: function (model, response, options) {
                    form.loading(false);
                    if (!response.error) {
                        form.trigger('success', model);
                    } else {
                        form.trigger('error', response.error);
                    }
                },
                error: function (model, response, options, err) {
                    var message = 'An unexpected error occured';
                    if (options && options.validationError) {
                        message = options.validationError;
                    }
                    form.loading(false);
                    form.trigger('error', message);
                }
            });
        },
        
    });
    
    App.Form = Form;
    
}(App));
