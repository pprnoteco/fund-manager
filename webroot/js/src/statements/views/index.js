/*
 |------------------------------------------------------------------------
 | App\Statements\View: Index
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Statements = App.Statements;
    var View = Statements.View;
    var Model = Statements.Model;
    var Table = Statements.Table;
    var Toolbar = Statements.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var CreateModal = Statements.CreateModal;
    var UpdateModal = Statements.UpdateModal;
    var DeleteModal = Statements.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var IndexView = View.extend({
        
        table: undefined,
        createModal: undefined,
        updateModal: undefined,
        deleteModal: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
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
                el: document.getElementById('statements-table'),
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
                el: document.getElementById('statements-table-toolbar'),
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
                el: document.getElementById('statements-table-searchbox'),
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
                el: document.getElementById('statements-table-pagination'),
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
                el: document.getElementById('statements-create-modal')
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
                el: document.getElementById('statements-update-modal')
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
                el: document.getElementById('statements-delete-modal')
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
        },
        
        /*
         |----------------------------------------------------------------
         | Read
         |----------------------------------------------------------------
         */
        
        read: function () {
            var model = this.table.selected;
            window.location.href = App.url('statements/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
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
        
    });
    
    App.Statements.views.Index = IndexView;
    
}(App));
