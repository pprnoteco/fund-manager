/*
 |------------------------------------------------------------------------
 | App\Transactions: Panel
 |------------------------------------------------------------------------
 */

(function(App){
     
    var Transactions = App.Transactions;
    var View = Transactions.View;
    var Model = Transactions.Model;
    var Table = Transactions.Table;
    var Toolbar = Transactions.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var ReadModal = Transactions.ReadModal;
    var CreateModal = Transactions.CreateModal;
    var UpdateModal = Transactions.UpdateModal;
    var DeleteModal = Transactions.DeleteModal;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Panel = View.extend({
        
        parent: undefined,
        parentId: undefined,
        investment: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.parent = options.parent;
            this.parentId = options.parentId;
            this.investment = options.investment;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('transactions-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
                sortField: 'date',
                sortOrder: 'asc',
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                if (!model) return;
                self.openReadModal(model);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('transactions-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('transactions-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('transactions-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initReadModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var panel = this;
            var collection = this.collection;
            var modal = new CreateModal({
                investment: this.investment,
                el: document.getElementById('transactions-create-modal'),
            });
            modal.on('success', function (model) {
                collection.add(model);
                panel.trigger('update');
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize read modal
         |----------------------------------------------------------------
         */
        
        initReadModal: function () {
            var self = this;
            var modal = new ReadModal({
                el: document.getElementById('transactions-read-modal'),
            });
            modal.on('update', function (model) {
                self.openUpdateModal(model);
            });
            this.readModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var panel = this;
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('transactions-update-modal'),
            });
            modal.on('success', function () {
                collection.trigger('update', collection, {});
                panel.trigger('update');
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var panel = this;
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('transactions-delete-modal'),
            });
            modal.on('success', function (model) {
                collection.remove(model);
                panel.trigger('update');
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #transactions-table-toolbar [data-action="create"]': 'openCreateModal',
            'click #transactions-table-toolbar [data-action="read"]'  : 'openReadModal',
            'click #transactions-table-toolbar [data-action="update"]': 'openUpdateModal',
            'click #transactions-table-toolbar [data-action="delete"]': 'openDeleteModal',
            'click #transactions-table-toolbar [data-action="export"]': 'export',
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            model.set('date', new Date());
            model.set('max_amount', this.investment.get('balance'));
            model.set('investment_id', this.parentId);
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open read modal
         |----------------------------------------------------------------
         */
        
        openReadModal: function () {
            var model = this.table.selected;
            var modal = this.readModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            model.set('max_amount', 
                this.investment.get('balance') + model.get('amount')
            );
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Export
         |----------------------------------------------------------------
         */
        
        export: function () {
            var parentId = this.parentId;
            $.ajax({
                url: App.url('transactions/export'),
                data: {
                    where: {
                        investment_id: parentId
                    }
                },
                success: function (content) {
                    _.forceDownload(
                        content,
                        'investment-' + parentId + '-transactions.csv',
                        'text/csv;encoding:utf-8'
                    );
                },
            });
        },
        
    });
    
    App.Transactions.Panel = Panel;
     
}(App));
