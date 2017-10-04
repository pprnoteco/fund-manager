/*
 |------------------------------------------------------------------------
 | App\Investments\Form: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateForm = Form.extend({
        
        funds: undefined,
        accounts: undefined,
        offerings: undefined,
        investors: undefined,

        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
    
        initialize: function (options) {
            this.funds = options.funds;
            this.accounts = options.accounts;
            this.offerings = options.offerings;
            this.investors = options.investors;
            
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
            var $funds = $elem.find('[name="fund"]');
            var $offerings = $elem.find('[name="offering_id"]');
            var $investors = $elem.find('[name="investor"]');
            var $accounts = $elem.find('[name="account_id"]');
            this.$funds = $funds;
            this.$offerings = $offerings;
            this.$investors = $investors;
            this.$accounts = $accounts;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize dropdowns
         |----------------------------------------------------------------
         */
        
        initDropdowns: function () {
            this.initFundsDropdown();
            this.initAccountsDropdown();
            this.initOfferingsDropdown();
            this.initInvestorsDropdown();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize funds dropdown
         |----------------------------------------------------------------
         */
    
        initFundsDropdown: function () {
            var self = this;
            var select = this.$funds[0];
            var option;
            
            this.funds.each(function (model) {
                option = document.createElement('option');
                option.value = model.get('id');
                option.innerHTML = model.get('name');
                select.appendChild(option);
            });
            
            this.$funds.on('change', function () {
                self.updateOfferingsDropdown($(this).val());
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize offerings dropdown
         |----------------------------------------------------------------
         */
    
        initOfferingsDropdown: function () {
            var select = this.$offerings[0];
            var option, id, label, date, rate;
            
            this.offerings.each(function (model) {
                id = model.get('id');
                date = model.get('date');
                date = date ? moment(date.toString().split('T')[0]).format('MM/DD/YYYY') : 'N/A';
                rate = model.get('rate');
                rate = (rate ? rate : 0).toFixed(3) + '%';
                option = document.createElement('option');
                option.value = id;
                option.innerHTML = date + ' - ' + rate;
                option.setAttribute('data-id', id);
                option.setAttribute('data-parent', model.get('fund_id'));
                select.appendChild(option);
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize investors dropdown
         |----------------------------------------------------------------
         */
    
        initInvestorsDropdown: function () {
            var self = this;
            var select = this.$investors[0];
            var option;
            
            this.investors.each(function (model) {
                option = document.createElement('option');
                option.value = model.get('id');
                option.innerHTML = model.get('name');
                select.appendChild(option);
            });
            
            this.$investors.on('change', function () {
                self.updateAccountsDropdown($(this).val());
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize accounts dropdown
         |----------------------------------------------------------------
         */
    
        initAccountsDropdown: function () {
            var select = this.$accounts[0];
            var option, id;
            
            this.accounts.each(function (model) {
                id = model.get('id');
                option = document.createElement('option');
                option.value = id;
                option.innerHTML = model.get('name');
                option.setAttribute('data-id', id);
                option.setAttribute('data-parent', model.get('investor_id'));
                select.appendChild(option);
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Update accounts dropdown
         |----------------------------------------------------------------
         */
        
        updateOfferingsDropdown: function (parent) {
            var $elem = this.$offerings;
            $elem.val('');
            $elem.find('[data-id]').addClass('d-none');
            if (!parent) {
                $elem.prop('disabled', true);
                return;
            }
            $elem.prop('disabled', false);
            $items = $elem.find('[data-parent="' + parent + '"]');
            $items.removeClass('d-none');
            $elem.val($items[$items.length - 1].value);
        },
        
        /*
         |----------------------------------------------------------------
         | Update accounts dropdown
         |----------------------------------------------------------------
         */
        
        updateAccountsDropdown: function (parent) {
            var $elem = this.$accounts;
            $elem.val('');
            $elem.find('[data-id]').addClass('d-none');
            if (!parent) {
                $elem.prop('disabled', true);
                return;
            }
            $elem.prop('disabled', false);
            $items = $elem.find('[data-parent="' + parent + '"]');
            $items.removeClass('d-none');
            $elem.val($items[0].value);
        },
        
        /*
         |----------------------------------------------------------------
         | Populate
         |----------------------------------------------------------------
         */
        
        populate: function () {
            Form.prototype.populate.call(this);
            var model = this.model;
            var accountId = model.get('account_id');
            var offeringId = model.get('offering_id');
            var account = this.accounts.get(accountId);
            var offering = this.offerings.get(offeringId);
            var fundId = offering.get('fund_id');
            var investorId = account.get('investor_id');
            this.$funds.val(fundId);
            this.$investors.val(investorId);
            this.updateOfferingsDropdown(fundId);
            this.updateAccountsDropdown(investorId);
            this.$accounts.val(accountId);
            this.$offerings.val(offeringId);
        },
        
    });
    
    App.Investments.UpdateForm = UpdateForm;
    
}(App));
