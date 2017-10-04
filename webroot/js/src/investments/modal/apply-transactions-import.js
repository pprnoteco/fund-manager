/*
 |------------------------------------------------------------------------
 | App\Investments\Modal: Apply transactions import
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Modal = App.Modal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ApplyTransactionsImportModal = Modal.extend({
        
        form: undefined,
        formId: 'apply-transactions-import-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'apply-transactions-import-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
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
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var self = this;
            var params = {};
            var alert = this.alert;
            var input = this.$input[0];
            var file = input.files[0];
            var data = new FormData();
            
            alert.clear();
            
            if (!file) {
                alert.set('Please select a file');
                return;
            }
            this.loading(true);
            
            data.append('file', file);
            
            params.url = App.url('/utility/csv-to-json.json');
            params.data = data;
            params.type = 'post';
            params.async = false;
            params.cache = false;
            params.contentType = false;
            params.processData = false;
            params.enctype = 'multipart/form-data';
            params.success = function (response) {
                if (!response.success) {
                    alert.set(response.error);
                } else {
                    self.trigger('success', response.data);
                    self.close();
                }
                self.loading(false);
            }
            params.error = function (response) {
                alert.set('An unexpected error occured');
                self.loading(false);
            }
            
            $.ajax(params);
        },
        
        /*
         |---------------------------------------------------------------------
         | Loading state on
         |---------------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-upload');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |---------------------------------------------------------------------
         | Loading state off
         |---------------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-upload');
        },
        
    });
    
    App.Investments.ApplyTransactionsImportModal = ApplyTransactionsImportModal;
    
}(App));
