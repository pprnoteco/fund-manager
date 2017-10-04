/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts\Modal: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var InvestorsAccounts = App.InvestorsAccounts;
    var Modal = App.Modal;
    var UpdateForm = InvestorsAccounts.UpdateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateModal = Modal.extend({
        
        form: undefined,
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'investors-accounts-update-modal-alert',
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
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
            var form = new UpdateForm({
                el: document.getElementById('investors-accounts-update-form')
            });
            this.form = form;
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
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                modal.close();
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
            this.$submitIcon.removeClass('fa-pencil-square-o');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-pencil-square-o');
        },
        
    });
    
    App.InvestorsAccounts.UpdateModal = UpdateModal;
    
}(App));
