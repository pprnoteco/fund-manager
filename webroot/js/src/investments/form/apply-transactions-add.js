/*
 |------------------------------------------------------------------------
 | App\Investments\Form: Apply transactions add
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ApplyTransactionsAddForm = Form.extend({
        
        investors: undefined,
        accounts: undefined,
        investments: undefined,

        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
    
        initialize: function (options) {
            this.investors = options.investors;
            this.accounts = options.accounts;
            this.investments = options.investments;
            this.initElement();
            this.initDropdowns();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
    
        initElement: function (options) {
            var $elem = this.$el;
            var $investors = $elem.find('[name="investor"]');
            var $accounts = $elem.find('[name="account"]');
            var $investments = $elem.find('[name="investment_id"]');
            this.$investors = $investors;
            this.$accounts = $accounts;
            this.$investments = $investments;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize dropdowns
         |----------------------------------------------------------------
         */
        
        initDropdowns: function () {
            this.initInvestorsDropdown();
            this.initAccountsDropdown();
            this.initInvestmentsDropdown();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize investors dropdown
         |----------------------------------------------------------------
         */
    
        initInvestorsDropdown: function () {
            var self = this;
            var $select = this.$investors;
            var select = $select[0];
            var option;
            
            this.investors.each(function (model) {
                if (model.get('investments_balance') <= 0) {
                    return;
                }
                option = document.createElement('option');
                option.value = model.get('id');
                option.innerHTML = model.get('name');
                select.appendChild(option);
            });
            
            $select.on('change', function () {
                self.trigger('investor-change', $select.val());
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize accounts dropdown
         |----------------------------------------------------------------
         */
    
        initAccountsDropdown: function () {
            var self = this;
            var $select = this.$accounts;
            var select = $select[0];
            var option;
            
            this.accounts.each(function (model) {
                if (model.get('investments_balance') <= 0) {
                    return;
                }
                option = document.createElement('option');
                option.value = model.get('id');
                option.innerHTML = model.get('name');
                option.setAttribute('data-id', model.id);
                option.setAttribute('data-parent', model.get('investor_id'));
                select.appendChild(option);
            });
            
            this.on('investor-change', function (id) {
                self.updateAccountsDropdown(id);
            });
            
            $select.on('change', function () {
                self.trigger('account-change', $select.val());
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize investments dropdown
         |----------------------------------------------------------------
         */
    
        initInvestmentsDropdown: function () {
            var self = this;
            var $select = this.$investments;
            var select = $select[0];
            var option, balance, clientId, date, fund, title;
            
            this.investments.each(function (model) {
                balance = model.get('balance');
                if (balance <= 0) {
                    return;
                }
                clientId = model.get('client_id');
                date = moment(model.get('date')).format('MM/DD/YYYY');
                balance = balance.toFixed(2).toString();
                balance = balance.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                fund = model.get('offering_fund_name');
                title = clientId + ' : ' + date + ' - $' + balance + ' - ' + fund;
                option = document.createElement('option');
                option.value = model.get('id');
                option.innerHTML = title;
                option.setAttribute('data-id', model.id);
                option.setAttribute('data-parent', model.get('account_id'));
                select.appendChild(option);
            });
            
            this.on('account-change', function (id) {
                self.updateInvestmentsDropdown(id);
            });
            
            $select.on('change', function () {
                self.trigger('investment-change', $select.val());
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Update accounts dropdown
         |----------------------------------------------------------------
         */
        
        updateAccountsDropdown: function (parent) {
            var $select = this.$accounts;
            $select.val('');
            $select.find('[data-id]').addClass('d-none');
            if (!parent) {
                this.trigger('account-change');
                $select.prop('disabled', true);
                return;
            }
            $select.prop('disabled', false);
            $items = $select.find('[data-parent="' + parent + '"]');
            $items.removeClass('d-none');
            if ($items.length) {
                $select.val($items[0].value);
            }
            this.trigger('account-change', $select.val());
        },
        
        /*
         |----------------------------------------------------------------
         | Update investments dropdown
         |----------------------------------------------------------------
         */
        
        updateInvestmentsDropdown: function (parent) {
            var $select = this.$investments;
            $select.val('');
            $select.find('[data-id]').addClass('d-none');
            if (!parent) {
                this.trigger('investment-change');
                $select.prop('disabled', true);
                return;
            }
            $select.prop('disabled', false);
            $items = $select.find('[data-parent="' + parent + '"]');
            $items.removeClass('d-none');
            if ($items.length) {
                $select.val($items[0].value);
            }
            this.trigger('investment-change', $select.val());
        },
        
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
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var model = this.toModel();
            if (!model.isValid()) {
                this.trigger('error', model.validationError);
                return;
            }
            this.trigger('success', model);
        },
        
    });
    
    App.Investments.ApplyTransactionsAddForm = ApplyTransactionsAddForm;
    
}(App));
