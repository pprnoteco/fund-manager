/*
 |------------------------------------------------------------------------
 | App\Accounts\Panel: Comments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var AccountsCommentsPanel = View.extend({
        
        account: undefined,
        parent: 'Accounts',
        parentId: undefined,
        table: undefined,
        toolbar: undefined,
        searchbox: undefined,
        pagination: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.modal = options.modal;
            this.parentId = options.parentId;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function (options) {
            var self = this;
            var Table = App.Accounts.CommentsTable;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            var table = new Table({
                el: document.getElementById('accounts-comments-table'),
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
                collection: this.collection,
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
                self.openUpdateModal();
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new App.Comments.Toolbar({
                el: document.getElementById(
                    'accounts-comments-table-toolbar'
                ),
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
                el: document.getElementById(
                    'accounts-comments-table-searchbox'
                ),
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
                el: document.getElementById(
                    'accounts-comments-table-pagination'
                ),
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
            var self = this;
            var modal = new App.Comments.CreateModal({
                el: document.getElementById(
                    'accounts-comments-create-modal'
                ),
                formId: 'accounts-comments-create-form',
                alertElement: 'accounts-comments-create-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.collection.add(model);
                self.account.set('comments', self.collection.toJSON());
                modal.swap(self.modal);
            });
            
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var self = this;
            var modal = new App.Comments.UpdateModal({
                el: document.getElementById(
                    'accounts-comments-update-modal'
                ),
                formId: 'accounts-comments-update-form',
                alertElement: 'accounts-comments-update-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.collection.trigger('update');
                self.account.set('comments', self.collection.toJSON());
                modal.swap(self.modal);
            });
            
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var self = this;
            var collection = this.collection;
            var modal = new App.Comments.DeleteModal({
                el: document.getElementById(
                    'accounts-comments-delete-modal'
                ),
                profileId: 'accounts-comments-delete-profile',
                alertElement: 'accounts-comments-delete-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.account.set('comments', collection.toJSON());
                modal.swap(self.modal);
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
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (account) {
            this.account = account;
            this.parentId = account.id;
            this.collection.reset(account.get('comments'));
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #accounts-comments-table-toolbar > [data-action="create"]': 'openCreateModal',
            'click #accounts-comments-table-toolbar > [data-action="read"]'  : 'openReadModal',
            'click #accounts-comments-table-toolbar > [data-action="update"]': 'openUpdateModal',
            'click #accounts-comments-table-toolbar > [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new App.Comments.Model();
            var modal = this.createModal;
            model.set('parent', this.parent);
            model.set('parent_id', this.parentId);
            modal.reset(model);
            this.modal.swap(modal);
        },
        
        /*
         |----------------------------------------------------------------
         | Open read modal
         |----------------------------------------------------------------
         */
        
        openReadModal: function () {
            
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
            this.modal.swap(modal);
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
            this.modal.swap(modal);
        },
        
    });
    
    App.Accounts.CommentsPanel = AccountsCommentsPanel;
     
}(App));
