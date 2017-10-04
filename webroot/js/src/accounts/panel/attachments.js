/*
 |------------------------------------------------------------------------
 | App\Accounts\Panel: Attachments
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
    
    var AccountsAttachmentsPanel = View.extend({
        
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
            var Table = App.Accounts.AttachmentsTable;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            var table = new Table({
                el: document.getElementById('accounts-attachments-table'),
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
                self.download();
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new App.Attachments.Toolbar({
                el: document.getElementById(
                    'accounts-attachments-table-toolbar'
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
                    'accounts-attachments-table-searchbox'
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
                    'accounts-attachments-table-pagination'
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
            var modal = new App.Attachments.CreateModal({
                el: document.getElementById(
                    'accounts-attachments-create-modal'
                ),
                formId: 'accounts-attachments-create-form',
                alertElement: 'accounts-attachments-create-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.collection.add(model);
                self.account.set('attachments', self.collection.toJSON());
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
            var modal = new App.Attachments.UpdateModal({
                el: document.getElementById(
                    'accounts-attachments-update-modal'
                ),
                formId: 'accounts-attachments-update-form',
                alertElement: 'accounts-attachments-update-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.collection.trigger('update');
                self.account.set('attachments', self.collection.toJSON());
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
            var modal = new App.Attachments.DeleteModal({
                el: document.getElementById(
                    'accounts-attachments-delete-modal'
                ),
                profileId: 'accounts-attachments-delete-profile',
                alertElement: 'accounts-attachments-delete-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.account.set('attachments', collection.toJSON());
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
            this.collection.reset(account.get('attachments'));
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #accounts-attachments-table-toolbar > [data-action="download"]'  : 'download',
            'click #accounts-attachments-table-toolbar > [data-action="create"]': 'openCreateModal',
            'click #accounts-attachments-table-toolbar > [data-action="update"]': 'openUpdateModal',
            'click #accounts-attachments-table-toolbar > [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Download
         |----------------------------------------------------------------
         */
        
        download: function () {
            var model = this.table.selected;
            window.location = App.url('attachments/download/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new App.Attachments.Model();
            var modal = this.createModal;
            model.set('parent', this.parent);
            model.set('parent_id', this.parentId);
            modal.reset(model);
            this.modal.swap(modal);
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
    
    App.Accounts.AttachmentsPanel = AccountsAttachmentsPanel;
     
}(App));
