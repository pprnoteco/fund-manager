/*
 |------------------------------------------------------------------------
 | App\Investments\Modal: Apply transactions submit
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Modal = App.Modal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ApplyTransactionsSubmitModal = Modal.extend({
        
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'apply-transactions-submit-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.initElement();
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
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var collection = this.collection;
            if (!collection) return;
            var totals = {
                '1': { count: 0, amount: 0 },
                '2': { count: 0, amount: 0 },
                '3': { count: 0, amount: 0 },
                total: { count: collection.length, amount: 0 },
            };
            collection.each(function (model) {
                var type = model.get('type').toString();
                var amount = model.get('amount');
                totals.total.amount += amount;
                totals[type].count ++;
                totals[type].amount += amount;
            });
            this.renderTable(totals);
        },
        
        /*
         |----------------------------------------------------------------
         | Render table
         |----------------------------------------------------------------
         */
        
        renderTable: function (totals) {
            var $elem = this.$el;
            _.each(totals, function (total, key) {
                $elem.find('[data-field="' + key + '-count"]').html(total.count);
                $elem.find('[data-field="' + key + '-amount"]').html(App.formats.currency(total.amount));
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (collection) {
            this.collection = collection;
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
            if (this.isLoading()) return;
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
            if (this.isLoading()) return;
            
            var self = this;
            var params = {};
            var alert = this.alert;
            
            alert.clear();
            this.loading(true);
            
            params.url = App.url('investments/apply-transactions.json');
            params.type = 'post';
            params.dataType = 'json';
            params.data = {json: JSON.stringify(this.collection.toJSON())};
            params.error = function (response) {
                alert.set('An unexpected error occured, please try again');
                self.loading(false);
            }
            params.success = function (response) {
                if (!response.success) {
                    alert.set(response.error);
                } else {
                    self.trigger('success', response);
                    self.close();
                }
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
            this.$el.data('bs.modal')._config.backdrop = 'static';
            this.$submitIcon.removeClass('fa-upload');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |---------------------------------------------------------------------
         | Loading state off
         |---------------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$el.data('bs.modal')._config.backdrop = true;
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-upload');
        },
        
    });
    
    App.Investments.ApplyTransactionsSubmitModal = ApplyTransactionsSubmitModal;
    
}(App));
