/*
 |------------------------------------------------------------------------
 | App\Accounts\Panel: Investments
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
    
    var AccountsInvestmentsPanel = View.extend({
        
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
            this.initTable();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function (options) {
            var self = this;
            var Table = App.Accounts.InvestmentsTable;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            var table = new Table({
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
                el: document.getElementById('accounts-investments-table'),
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
            
            table.on('dblclick', function () {
                self.read();
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new App.Investments.Toolbar({
                el: document.getElementById(
                    'accounts-investments-table-toolbar'
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
                    'accounts-investments-table-searchbox'
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
                    'accounts-investments-table-pagination'
                ),
            });
            this.pagination = pagination;
            return pagination;
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
         | Render
         |----------------------------------------------------------------
         */
        
        reset: function (account) {
            this.account = account;
            this.parentId = account.id;
            this.collection.reset(account.get('investments'));
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #accounts-investments-table-toolbar [data-action="read"]': 'read',
            'click #accounts-investments-table-toolbar [data-action="export"]': 'export'
        },
        
        /*
         |----------------------------------------------------------------
         | Read
         |----------------------------------------------------------------
         */
        
        read: function () {
            var model = this.table.selected;
            if (!model) return;
            window.location = App.url('investments/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Export
         |----------------------------------------------------------------
         */
        
        export: function () {
            var parentId = this.parentId;
            $.ajax({
                url: App.url('investments/export'),
                data: {
                    where: {
                        'account_id': parentId
                    }
                },
                success: function (content) {
                    _.forceDownload(
                        content,
                        'account-' + parentId + '-investments.csv',
                        'text/csv; charset=UTF-8'
                    );
                },
            });
        },
        
    });
    
    App.Accounts.InvestmentsPanel = AccountsInvestmentsPanel;
     
}(App));
