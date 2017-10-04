/*
 |------------------------------------------------------------------------
 | App\Offerings: Panel
 |------------------------------------------------------------------------
 */

(function(App){
     
    var Offerings = App.Offerings;
    var View = Offerings.View;
    var Model = Offerings.Model;
    var Table = Offerings.Table;
    var Toolbar = Offerings.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var ReadModal = Offerings.ReadModal;
    var CreateModal = Offerings.CreateModal;
    var UpdateModal = Offerings.UpdateModal;
    var DeleteModal = Offerings.DeleteModal;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Panel = View.extend({
        
        fund: undefined,
        parent: 'Funds',
        parentId: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.fund = options.fund;
            this.parentId = this.fund.id;
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
                el: document.getElementById('offerings-table'),
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
                el: document.getElementById('offerings-table-toolbar'),
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
                el: document.getElementById('offerings-table-searchbox'),
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
                el: document.getElementById('offerings-table-pagination'),
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
                el: document.getElementById('offerings-create-modal'),
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
                el: document.getElementById('offerings-read-modal'),
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
                el: document.getElementById('offerings-update-modal'),
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
                el: document.getElementById('offerings-delete-modal'),
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
            'click #offerings-table-toolbar [data-action="create"]': 'openCreateModal',
            'click #offerings-table-toolbar [data-action="read"]'  : 'openReadModal',
            'click #offerings-table-toolbar [data-action="update"]': 'openUpdateModal',
            'click #offerings-table-toolbar [data-action="delete"]': 'openDeleteModal',
            'click #offerings-table-toolbar [data-action="export"]': 'export',
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            model.set('fund_id', this.parentId);
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
        
        /*
         |----------------------------------------------------------------
         | Export
         |----------------------------------------------------------------
         */
        
        export: function () {
            var parentId = this.parentId;
            $.ajax({
                url: App.url('offerings/export'),
                data: {
                    where: {
                        fund_id: parentId
                    }
                },
                success: function (content) {
                    _.forceDownload(
                        content,
                        'fund-' + parentId + '-offerings.csv',
                        'text/csv; charset=UTF-8'
                    );
                },
            });
        },
        
    });
    
    App.Offerings.Panel = Panel;
     
}(App));
