/*
 |------------------------------------------------------------------------
 | App\Offerings\Panel: Attachments
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
    
    var OfferingsAttachmentsPanel = View.extend({
        
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
            var Table = App.Offerings.AttachmentsTable;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            var table = new Table({
                el: document.getElementById('offerings-attachments-table'),
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
                    'offerings-attachments-table-toolbar'
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
                    'offerings-attachments-table-searchbox'
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
                    'offerings-attachments-table-pagination'
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
                    'offerings-attachments-create-modal'
                ),
                formId: 'offerings-attachments-create-form',
                alertElement: 'offerings-attachments-create-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.collection.add(model);
                self.offering.set('attachments', self.collection.toJSON());
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
                    'offerings-attachments-update-modal'
                ),
                formId: 'offerings-attachments-update-form',
                alertElement: 'offerings-attachments-update-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.collection.trigger('update');
                self.offering.set('attachments', self.collection.toJSON());
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
                    'offerings-attachments-delete-modal'
                ),
                profileId: 'offerings-attachments-delete-profile',
                alertElement: 'offerings-attachments-delete-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.offering.set('attachments', collection.toJSON());
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
            this.collection.reset(offering.get('attachments'));
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #offerings-attachments-table-toolbar > [data-action="download"]'  : 'download',
            'click #offerings-attachments-table-toolbar > [data-action="create"]': 'openCreateModal',
            'click #offerings-attachments-table-toolbar > [data-action="update"]': 'openUpdateModal',
            'click #offerings-attachments-table-toolbar > [data-action="delete"]': 'openDeleteModal',
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
    
    App.Offerings.AttachmentsPanel = OfferingsAttachmentsPanel;
     
}(App));
