/*
 |------------------------------------------------------------------------
 | App\Investors\Modal: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investors = App.Investors;
    var Modal = App.Modal;
    var CreateForm = Investors.CreateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateModal = Modal.extend({
        
        form: undefined,
        formId: 'investors-create-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'investors-create-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
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
            var form = new CreateForm({
                el: document.getElementById(this.formId)
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function (model) {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.trigger('cancel', this.model);
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
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-plus');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-plus');
        },
        
    });
    
    App.Investors.CreateModal = CreateModal;
    
}(App));
