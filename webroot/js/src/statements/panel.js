/*
 |------------------------------------------------------------------------
 | App\Statements: Panel
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
    var SyncModal = Statements.SyncModal;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Panel = View.extend({
        
        parent: undefined,
        parentId: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.parent = options.parent;
            this.parentId = options.parentId;
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
                sortField: 'date',
                sortOrder: 'desc',
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
            this.initSyncModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize syn modal
         |----------------------------------------------------------------
         */
        
        initSyncModal: function () {
            var modal = new SyncModal({
                el: document.getElementById('statements-sync-modal')
            });
            this.syncModal = modal;
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
            'click #statements-table-toolbar [data-action="sync"]': 'openSyncModal',
            'click #statements-table-toolbar [data-action="download"]'  : 'download',
        },
        
        /*
         |----------------------------------------------------------------
         | Download
         |----------------------------------------------------------------
         */
        
        download: function () {
            var model = this.table.selected;
            var modal = this.readModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open sync modal
         |----------------------------------------------------------------
         */
        
        openSyncModal: function () {
            var modal = this.syncModal;
            modal.open();
        },
        
    });
    
    App.Statements.Panel = Panel;
     
}(App));
