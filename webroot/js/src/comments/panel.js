/*
 |------------------------------------------------------------------------
 | App\Comments: Panel
 |------------------------------------------------------------------------
 */

(function(App){
     
    var Comments = App.Comments;
    var View = Comments.View;
    var Model = Comments.Model;
    var Table = Comments.Table;
    var Toolbar = Comments.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var ReadModal = Comments.ReadModal;
    var CreateModal = Comments.CreateModal;
    var UpdateModal = Comments.UpdateModal;
    var DeleteModal = Comments.DeleteModal;
    
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
                el: document.getElementById('comments-table'),
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
                el: document.getElementById('comments-table-toolbar'),
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
                el: document.getElementById('comments-table-searchbox'),
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
                el: document.getElementById('comments-table-pagination'),
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
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('comments-create-modal'),
            });
            modal.on('success', function (model) {
                collection.add(model);
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
                el: document.getElementById('comments-read-modal'),
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
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('comments-update-modal'),
            });
            modal.on('success', function () {
                collection.trigger('update', collection, {});
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
                el: document.getElementById('comments-delete-modal'),
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
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="read"]'  : 'openReadModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            model.set('parent', this.parent);
            model.set('parent_id', this.parentId);
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
    
    App.Comments.Panel = Panel;
     
}(App));
