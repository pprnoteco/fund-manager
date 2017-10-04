/*
 |------------------------------------------------------------------------
 | App\Investments\View: Index
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investments = App.Investments;
    var View = Investments.View;
    var Model = Investments.Model;
    var Table = Investments.Table;
    var Toolbar = Investments.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var CreateModal = Investments.CreateModal;
    var UpdateModal = Investments.UpdateModal;
    var DeleteModal = Investments.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var IndexView = View.extend({
        
        funds: undefined,
        accounts: undefined,
        offerings: undefined,
        investors: undefined,
        
        table: undefined,
        toolbar: undefined,
        searchbox: undefined,
        pagination: undefined,
        createModal: undefined,
        updateModal: undefined,
        deleteModal: undefined,
        
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
                el: document.getElementById('investments-table'),
                sortField: 'date',
                sortOrder: 'desc',
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
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
                self.read(model.id);
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
                el: document.getElementById('investments-table-toolbar'),
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
                el: document.getElementById('investments-table-searchbox'),
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
                el: document.getElementById('investments-table-pagination'),
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
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('investments-create-modal'),
                funds: this.funds,
                accounts: this.accounts,
                offerings: this.offerings,
                investors: this.investors,
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('investments-update-modal'),
                funds: this.funds,
                accounts: this.accounts,
                offerings: this.offerings,
                investors: this.investors,
            });
            modal.on('success', function (model) {
                collection.trigger('update');
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('investments-delete-modal')
            });
            modal.on('success', function (model) {
                collection.remove(model);
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
            'click [data-action="read"]': 'read',
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
            'click [data-action="export"]': 'export',
        },
        
        /*
         |----------------------------------------------------------------
         | Read
         |----------------------------------------------------------------
         */
        
        read: function () {
            var model = this.table.selected;
            window.location.href = App.url('investments/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model({
                date: new Date()
            });
            var modal = this.createModal;
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
            $.ajax({
                url: App.url('investments/export'),
                success: function (content) {
                    _.forceDownload(
                        content,
                        'investments.csv',
                        'text/csv;encoding:utf-8'
                    );
                },
            });
        },
        
    });
    
    App.Investments.views.Index = IndexView;
    
}(App));
