/*
 |------------------------------------------------------------------------
 | App\Attachments\Form: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateForm = Form.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            var $input = this.$el.find('[data-field="file"]');
            var $label = $input.siblings('span');
            $input.on('change', function () {
                var file = this.files[0];
                if (file) {
                    $label.html(file.name);
                } else {
                    $label.html('');
                }
            });
            this.$input = $input;
        },
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function () {
            var input = this.$input[0];
            var file = input.files[0];
            if (!file) {
                return 'Please select a file';
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var form = this;
            var model = this.model;
            var error = this.validate();
            if (error) {
                this.trigger('error', error);
            }
            model.set('file', this.$input[0].files[0]);
            this.loading(true);
            
            model.save(model.attributes, {
                success: function (model, response, options) {
                    form.loading(false);
                    if (!response.error) {
                        form.trigger('success', model);
                    } else {
                        form.trigger('error', response.error);
                    }
                },
                error: function (model, response, options) {
                    form.loading(false);
                    form.trigger('error', 'An unexpected error occured');
                }
            });
        },
        
    });
    
    App.Attachments.CreateForm = CreateForm;
    
}(App));
