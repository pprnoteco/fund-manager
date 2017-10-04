/*
 |-----------------------------------------------------------------------------
 | App\Investments\View: Apply transactions
 |-----------------------------------------------------------------------------
 */

(function(App){
    
    var Investments = App.Investments;
    var View = Investments.View;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;

    /*
     |-------------------------------------------------------------------------
     | Constructor
     |-------------------------------------------------------------------------
     */
    
    var ApplyTransactionsView = View.extend({
        
        date: undefined,
        ready: false,
        error: false,
        investments: undefined,
        accounts: undefined,
        investors: undefined,
        transactions: undefined,
        offerings: undefined,
        funds: undefined,
        deletedTransactions: undefined,
        
        /*
         |---------------------------------------------------------------------
         | Initialize
         |---------------------------------------------------------------------
         */
        
        initialize: function (options) {
            var self = this;
            this.date = options.date;
            this.once('ready', function () {
                if (self.transactions.length == 0) {
                    return self._upToDate();
                }
                self.initTable();
                self.initModals();
                self.render();
            });
            this.initElement();
            this.loading(true);
            this.initInvestments();
            this.initAccounts();
            this.initInvestors();
            this.initTransactions();
            this.initFunds();
            this.initOfferings();
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize element
         |---------------------------------------------------------------------
         */
        
        initElement: function () {
            var $table = $('#transactions-table');
            var $toolbar = $('#transactions-table-toolbar');
            this.$table = $table;
            this.$tbody = $table.find('tbody');
            this.$toolbar = $toolbar;
            this.$create = $toolbar.find('[data-action="create"]');
            this.$export = $toolbar.find('[data-action="export"]');
            this.$import = $toolbar.find('[data-action="import"]');
            this.$undoUpdate = $toolbar.find('[data-action="undo-update"]');
            this.$undoDelete = $toolbar.find('[data-action="undo-delete"]');
            this.$recalc = $toolbar.find('[data-action="recalculate"]');
            this.$searchbox = $('#transactions-table-searchbox');
            this.$pagination = $('#transactions-table-pagination');
            this.$form = $('#transactions-table-form');
            this.$error = $('#error-message');
            this.$loading = $('#loading-message');
            this.$success = $('#success-message');
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize investments
         |---------------------------------------------------------------------
         */
        
        initInvestments: function () {
            var self = this;
            var Collection = App.Investments.Collection;
            var collection = new Collection();
            collection.fetch({
                success: function () {
                    self.investments = collection;
                    self._ready();
                }
            });
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize accounts
         |---------------------------------------------------------------------
         */
        
        initAccounts: function () {
            var self = this;
            var Collection = App.Accounts.Collection;
            var collection = new Collection();
            collection.fetch({
                success: function () {
                    self.accounts = collection;
                    self._ready();
                }
            });
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize investors
         |---------------------------------------------------------------------
         */
        
        initInvestors: function () {
            var self = this;
            var Collection = App.Investors.Collection;
            var collection = new Collection();
            collection.fetch({
                success: function () {
                    self.investors = collection;
                    self._ready();
                }
            });
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize transactions
         |---------------------------------------------------------------------
         */
        
        initTransactions: function () {
            var self = this;
            var Collection = App.Transactions.Collection;
            var updated = new App.Collection();
            var deleted = new App.Collection();
            var collection = new Collection();
            
            updated.comparator = '__update_timestamp';
            deleted.comparator = '__delete_timestamp';
            
            collection.on('change', function (model) {
                if (!_.isModel(model)) return;
                if (model.get('__delete_timestamp')) {
                    return;
                }
                if (model.get('__is_undo')) {
                    model.unset('__is_undo', { silent: true });
                    collection.trigger('update');
                    return true;
                }
                var model_ = new App.Model({
                    previous: model.previousAttributes(),
                    __cid: model.cid,
                    __update_timestamp: new Date
                });
                self.$undoUpdate.prop('disabled', false);
                updated.add(model_);
            });
            
            collection.on('remove', function (model) {
                model.set('__delete_timestamp', new Date);
                self.$undoDelete.prop('disabled', false);
                deleted.add(model);
            });
            
            updated.on('remove', function (model_) {
                var cid = model_.get('__cid');
                var attrs = model_.get('previous');
                var model = collection.get(cid);
                attrs.__is_undo = true;
                model.set(attrs);
                if (updated.length == 0) {
                    self.$undoUpdate.prop('disabled', true);
                }
            });
            
            deleted.on('remove', function (model) {
                model.unset('__delete_timestamp');
                collection.add(model);
                if (deleted.length == 0) {
                    self.$undoDelete.prop('disabled', true);
                }
            });
            
            var date = moment(this.date).format('YYYY-MM-DD');
            var settings = {
                url: App.url('investments/calculate-transactions/' + date + '.json'),
                success: function (transactions) {
                    collection.reset(transactions);
                    self.deleted = deleted;
                    self.updated = updated;
                    self.transactions = collection;
                    self._ready();
                }
            };
            
            $.ajax(settings);
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize funds
         |---------------------------------------------------------------------
         */
        
        initFunds: function () {
            var self = this;
            var Collection = App.Funds.Collection;
            var collection = new Collection();
            collection.fetch({
                success: function () {
                    self.funds = collection;
                    self._ready();
                }
            });
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize offerings
         |---------------------------------------------------------------------
         */
        
        initOfferings: function () {
            var self = this;
            var Collection = App.Offerings.Collection;
            var collection = new Collection();
            collection.fetch({
                success: function () {
                    self.offerings = collection;
                    self._ready();
                }
            });
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize table
         |---------------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var $undo = this.$undo;
            var deleted = this.deletedTransactions;
            var collection = this.transactions;
            var Table = App.Transactions.Table;
            var table = new Table({
                collection: collection,
                toolbar: this.initToolbar(),
                searchbox: this.initSearchbox(),
                pagination: this.initPagination(),
                selectable: false,
                sortField: 'client_id',
                sortOrder: 'desc',
                formats: {
                    delete: function () {
                        var model = this;
                        var link = document.createElement('a');
                        var icon = document.createElement('span');
                        icon.className = 'text-danger fa fa-trash';
                        link.href = '#';
                        link.appendChild(icon);
                        $(link).on('click', function () {
                            collection.remove(model);
                        });
                        return link;
                    },
                    date: function (date) {
                        var model = this;
                        var input = document.createElement('input');
                        input.className = 'form-control';
                        input.type = 'date';
                        input.value = date;
                        $(input).on('change', function () {
                            model.set('date', this.value);
                        });
                        return input;
                    },
                    type: function (type) {
                        var model = this;
                        var select = document.createElement('select');
                        var option1 = document.createElement('option');
                        var option2 = document.createElement('option');
                        var option3 = document.createElement('option');
                        option1.innerHTML = 'Preferred payment (prorated)';
                        option1.value = 1;
                        if (type == 1) {
                            option1.selected = true;
                        }
                        option2.innerHTML = 'Preferred payment';
                        option2.value = 2;
                        if (type == 2) {
                            option2.selected = true;
                        }
                        option3.innerHTML = 'Drawdown';
                        option3.value = 3;
                        if (type == 3) {
                            option3.selected = true;
                        }
                        select.className = 'form-control';
                        select.appendChild(option1);
                        select.appendChild(option2);
                        select.appendChild(option3);
                        $(select).on('change', function () {
                            model.set('type', $(this).val());
                        });
                        return select;
                    },
                    amount: function (amount) {
                        var model = this;
                        var input = document.createElement('input');
                        input.className = 'form-control';
                        input.type = 'number';
                        input.value = parseFloat(amount).toFixed(2);
                        $(input).on('change', function () {
                            model.set('amount', this.value);
                        });
                        return input;
                    },
                    add: function () {
                        var model = this.clone();
                        var link = document.createElement('a');
                        var icon = document.createElement('span');
                        icon.className = 'text-success fa fa-plus';
                        link.href = '#';
                        link.appendChild(icon);
                        $(link).on('click', function () {
                            self.openCreateModal(model);
                        });
                        return link;
                    },
                },
                el: this.$table[0],
            });
            this.table = table;
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize toolbar
         |---------------------------------------------------------------------
         */
        
        initToolbar: function () {
            var element = this.$toolbar[0];
            var Toolbar = App.Transactions.Toolbar;
            var toolbar = new Toolbar({el: element});
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize searchbox
         |---------------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var element = this.$searchbox[0];
            var searchbox = new Searchbox({el: element});
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize pagination
         |---------------------------------------------------------------------
         */
        
        initPagination: function () {
            var element = this.$pagination[0];
            var pagination = new Pagination({el: element});
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize modals
         |---------------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initImportModal();
            this.initSubmitModal();
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize create modal
         |---------------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var transactions = this.transactions;
            var Modal = App.Investments.ApplyTransactionsAddModal;
            var modal = new Modal({
                investors: this.investors,
                accounts: this.accounts,
                investments: this.investments,
                el: document.getElementById('apply-transactions-add-modal')
            });
            modal.on('success', function (model) {
                transactions.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize create modal
         |---------------------------------------------------------------------
         */
        
        initImportModal: function () {
            var self = this;
            var accounts = self.accounts;
            var investors = self.investors;
            var investments = self.investments;
            var transactions = self.transactions;
            var offerings, funds;
            var investment, account, investor, offering, fund;
            var Modal = App.Investments.ApplyTransactionsImportModal;
            var modal = new Modal({
                el: document.getElementById('apply-transactions-import-modal')
            });
            modal.on('success', function (records) {
                funds = self.funds;
                offerings = self.offerings;
                transactions.reset(records);
                transactions.each(function (model) {
                    investment = investments.get(model.get('investment_id'));
                    account = accounts.get(investment.get('account_id'));
                    offering = offerings.get(investment.get('offering_id'));
                    investor = investors.get(account.get('investor_id'));
                    fund = funds.get(offering.get('fund_id'));
                    model.set('client_id', investment.get('client_id'));
                    model.set('investment_amount', investment.get('amount'));
                    model.set('investment_date', investment.get('date'));
                    model.set('investment_term', investment.get('term'));
                    model.set('investment_balance', investment.get('balance'));
                    model.set('investment_rate', offering.get('rate'));
                    model.set('fund_name', fund.get('name'));
                    model.set('investor_name', investor.get('name'));
                    model.set('account_name', account.get('name'));
                });
                transactions.trigger('update');
            });
            this.importModal = modal;
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize submit modal
         |---------------------------------------------------------------------
         */
        
        initSubmitModal: function () {
            var Modal = App.Investments.ApplyTransactionsSubmitModal;
            var modal = new Modal({
                el: document.getElementById('apply-transactions-submit-modal')
            });
            modal.on('success', function (model) {
                
            });
            this.submitModal = modal;
        },
        
        /*
         |---------------------------------------------------------------------
         | Render
         |---------------------------------------------------------------------
         */
        
        render: function () {
            if (!this.ready) return;
            this.table.render();
            this.createModal.render();
            this.importModal.render();
            this.submitModal.render();
        },
        
        /*
         |---------------------------------------------------------------------
         | Events
         |---------------------------------------------------------------------
         */
        
        events: {
            'click #transactions-table-form [data-action="submit"]': 'openSubmitModal',
            'click #transactions-table-toolbar [data-action="create"]': 'openCreateModal',
            'click #transactions-table-toolbar [data-action="export"]': 'export',
            'click #transactions-table-toolbar [data-action="import"]': 'openImportModal',
            'click #transactions-table-toolbar [data-action="undo-update"]': 'undoUpdate',
            'click #transactions-table-toolbar [data-action="undo-delete"]': 'undoDelete',
            'click #transactions-table-toolbar [data-action="recalculate"]': 'recalculate',
        },
        
        /*
         |---------------------------------------------------------------------
         | Open submit modal
         |---------------------------------------------------------------------
         */
        
        openSubmitModal: function (model) {
            var collection = this.transactions;
            var modal = this.submitModal;
            modal.reset(collection);
            modal.open();
        },
        
        /*
         |---------------------------------------------------------------------
         | Open create modal
         |---------------------------------------------------------------------
         */
        
        openCreateModal: function (model) {
            var Model = App.Transactions.Model;
            var investment, accout, investor;
            if (!_.isModel(model)) {
                model = new Model({date: new Date()});
            } else {
                investment = this.investments.get(model.get('investment_id'));
                account = this.accounts.get(investment.get('account_id'));
                investor = this.investors.get(account.get('investor_id'));
            }
            var modal = this.createModal;
            modal.reset(model);
            modal.open();
            if (investor) {
                modal.updateInvestor(investor);
                modal.updateAccount(account);
                modal.updateInvestment(investment);
            }
        },
        
        /*
         |---------------------------------------------------------------------
         | Export
         |---------------------------------------------------------------------
         */
        
        export: function () {
            var content = [];
            var filename = 'transactions.csv';
            var filetype = 'text/csv;encoding:utf-8';
            
            // Header row
            content.push(_.formatCsvRow([
                /* 0  */ 'investment_id',
                /* 1  */ 'date',
                /* 2  */ 'type',
                /* 3  */ 'amount',
                /* 4  */ 'description',
                /* 5  */ 'client_id',
                /* 6  */ 'investment_amount',
                /* 7  */ 'investment_date',
                /* 8  */ 'investment_term',
                /* 9  */ 'investment_balance',
                /* 10 */ 'investment_rate',
                /* 11 */ 'fund_name',
                /* 12 */ 'investor_name',
                /* 13 */ 'account_name'
            ]));
            
            // Add body rows
            this.transactions.each(function (model) {
                var type = model.get('type');
                content.push(_.formatCsvRow([
                    /* 0  */ model.get('investment_id'),
                    /* 1  */ model.get('date'),
                    /* 2  */ type,
                    /* 3  */ parseFloat(model.get('amount')).toFixed(2),
                    /* 4  */ App.Transactions.typeDescription(type),
                    /* 5  */ model.get('client_id'),
                    /* 6  */ model.get('investment_amount'),
                    /* 7  */ moment(model.get('investment_date')).format('MM/DD/YYYY'),
                    /* 8  */ model.get('investment_term'),
                    /* 9  */ model.get('investment_balance'),
                    /* 10 */ (model.get('investment_rate') / 100).toFixed(3),
                    /* 11 */ model.get('fund_name'),
                    /* 12 */ model.get('investor_name'),
                    /* 13 */ model.get('account_name'),
                ]));
            });
            
            // Download content
            _.forceDownload(content.join('\n'), filename, filetype);
        },
        
        /*
         |---------------------------------------------------------------------
         | Open import modal
         |---------------------------------------------------------------------
         */
        
        openImportModal: function (model) {
            var modal = this.importModal;
            modal.open();
        },
        
        /*
         |---------------------------------------------------------------------
         | Undo update
         |---------------------------------------------------------------------
         */
        
        undoUpdate: function () {
            var updated = this.updated;
            updated.models.reverse();
            updated.shift();
            updated.models.reverse();
        },
        
        /*
         |---------------------------------------------------------------------
         | Undo delete
         |---------------------------------------------------------------------
         */
        
        undoDelete: function () {
            var deleted = this.deleted;
            deleted.models.reverse();
            deleted.shift();
            deleted.models.reverse();
        },
        
        /*
         |---------------------------------------------------------------------
         | Recalculate
         |---------------------------------------------------------------------
         */
        
        recalculate: function () {
            $input = this.$toolbar.find('[data-action="effective-date"]');
            window.location = App.url('investments/apply-transactions/' + moment($input.val()).format('YYYY-MM-DD'));
        },
        
        /*
         |---------------------------------------------------------------------
         | Loading state on
         |---------------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$tbody.addClass('d-none');
            this.$pagination.addClass('d-none');
            this.$form.addClass('d-none');
            this.$error.addClass('d-none');
            this.$loading.removeClass('d-none');
            this.$create.prop('disabled', true);
            this.$export.prop('disabled', true);
            this.$import.prop('disabled', true);
            this.$recalc.prop('disabled', true);
        },
        
        /*
         |---------------------------------------------------------------------
         | Loading state off
         |---------------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            if (!this.error) {
                this.$tbody.removeClass('d-none');
                this.$pagination.removeClass('d-none');
                this.$form.removeClass('d-none');
                this.$create.prop('disabled', false);
                this.$export.prop('disabled', false);
                this.$import.prop('disabled', false);
                this.$recalc.prop('disabled', false);
            }
            this.$loading.addClass('d-none');
        },
        
        /*
         |---------------------------------------------------------------------
         | Ready
         |---------------------------------------------------------------------
         */
        
        _ready: function () {
            if (this.funds &&
                this.accounts &&
                this.investors &&
                this.offerings &&
                this.investments &&
                this.transactions) {
                this.ready = true;
                this.loading(false);
                this.trigger('ready');
            }
        },
        
        /*
         |---------------------------------------------------------------------
         | Up to date
         |---------------------------------------------------------------------
         */
        
        _upToDate: function () {
            this.$tbody.addClass('d-none');
            this.$pagination.addClass('d-none');
            this.$form.addClass('d-none');
            this.$error.addClass('d-none');
            this.$loading.removeClass('d-none');
            this.$create.prop('disabled', true);
            this.$export.prop('disabled', true);
            this.$import.prop('disabled', true);
            this.$loading.addClass('d-none');
            this.$success.removeClass('d-none');
        },
        
        /*
         |---------------------------------------------------------------------
         | Download
         |---------------------------------------------------------------------
         */
        
        download: function () {
            
            var format = this.csvRow;
            var collection = this.collection;
            var csv = [format([
                'id',
                'date',
                'amount',
                'account',
                'investor'
            ])];
            
            collection.each(function (model) {
                var row = [];
                var account = model.get('account');
                var investors = account.investors;
                var investor = [];
                _.each(investors, function (item) {
                    investor.push(item.name);
                });
                investor = investor.join(',');
                
                row.push(model.get('id'));
                row.push(model.get('date'));
                row.push(model.get('amount'));
                row.push(account.name);
                row.push(investor);
                
                csv.push(format(row));
            });
            
            var a = document.createElement('a');
            var content = csv.join('\n');
            var filename = 'transactions-to-apply.csv';
            a.href = URL.createObjectURL(new Blob([content], {
                type: 'text/csv;encoding:utf-8'
            }));
            a.setAttribute('download', filename);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },
        
        csvRow: function (data) {
            var csv = [];
            _.each(data, function (value) {
                if (value.toString().indexOf(',') >= 0) {
                    value = '"' + value + '"';
                }
                csv.push(value);
            });
            return csv.join(',');
        }
        
    });
    
    App.Investments.views.ApplyTransactions = ApplyTransactionsView;
    
}(App));
