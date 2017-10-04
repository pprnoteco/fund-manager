/*
 |------------------------------------------------------------------------
 | App\Investments\Modal: Apply transactions add
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investments = App.Investments;
    var Modal = App.Modal;
    var CreateForm = Investments.ApplyTransactionsAddForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ApplyTransactionsAddModal = Modal.extend({
        
        investors: undefined,
        accounts: undefined,
        investments: undefined,
        
        form: undefined,
        formId: 'apply-transactions-add-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'apply-transactions-add-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.investors = options.investors;
            this.accounts = options.accounts;
            this.investments = options.investments;
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
                investors: this.investors,
                accounts: this.accounts,
                investments: this.investments,
                el: document.getElementById(this.formId),
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
         |---------------------------------------------------------------------
         | Update investor
         |---------------------------------------------------------------------
         */
        
        updateInvestor: function (investor) {
            this.form.$investors.val(investor.id);
            this.form.updateAccountsDropdown(investor.id);
        },
        
        /*
         |---------------------------------------------------------------------
         | Update account
         |---------------------------------------------------------------------
         */
        
        updateAccount: function (account) {
            this.form.$accounts.val(account.id);
            this.form.updateInvestmentsDropdown(account.id);
        },
        
        /*
         |---------------------------------------------------------------------
         | Update investment
         |---------------------------------------------------------------------
         */
        
        updateInvestment: function (investment) {
            this.form.$investments.val(investment.id);
            this.form.trigger('investment-change', investment);
        },
        
        /*
         |---------------------------------------------------------------------
         | Loading state on
         |---------------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-plus');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |---------------------------------------------------------------------
         | Loading state off
         |---------------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-plus');
        },
        
    });
    
    App.Investments.ApplyTransactionsAddModal = ApplyTransactionsAddModal;
    
}(App));
