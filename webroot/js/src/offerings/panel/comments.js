/*
 |------------------------------------------------------------------------
 | App\Offerings\Panel: Comments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    var Toolbar = App.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var OfferingsCommentsPanel = View.extend({
        
        offering: undefined,
        parent: 'Offerings',
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
            var Table = App.Offerings.CommentsTable;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            var table = new Table({
                el: document.getElementById('offerings-comments-table'),
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
                    'offerings-comments-table-toolbar'
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
                    'offerings-comments-table-searchbox'
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
                    'offerings-comments-table-pagination'
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
                    'offerings-comments-create-modal'
                ),
                formId: 'offerings-comments-create-form',
                alertElement: 'offerings-comments-create-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.collection.add(model);
                self.offering.set('comments', self.collection.toJSON());
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
                    'offerings-comments-update-modal'
                ),
                formId: 'offerings-comments-update-form',
                alertElement: 'offerings-comments-update-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.collection.trigger('update');
                self.offering.set('comments', self.collection.toJSON());
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
                    'offerings-comments-delete-modal'
                ),
                profileId: 'offerings-comments-delete-profile',
                alertElement: 'offerings-comments-delete-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.offering.set('comments', collection.toJSON());
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
        
        reset: function (offering) {
            this.offering = offering;
            this.parentId = offering.id;
            this.collection.reset(offering.get('comments'));
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #offerings-comments-table-toolbar > [data-action="create"]': 'openCreateModal',
            'click #offerings-comments-table-toolbar > [data-action="read"]'  : 'openReadModal',
            'click #offerings-comments-table-toolbar > [data-action="update"]': 'openUpdateModal',
            'click #offerings-comments-table-toolbar > [data-action="delete"]': 'openDeleteModal',
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
    
    App.Offerings.CommentsPanel = OfferingsCommentsPanel;
     
}(App));
