/*
 |------------------------------------------------------------------------
 | App\Funds\Panel: Investments
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
    
    var FundsInvestmentsPanel = View.extend({
        
        fund: undefined,
        parent: 'Funds',
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
            this.fund = options.fund;
            this.parentId = this.fund.id;
            this.initTable();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function (options) {
            var self = this;
            var Table = App.Funds.InvestmentsTable;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            var table = new Table({
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
                el: document.getElementById('funds-investments-table'),
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
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new App.Investments.Toolbar({
                el: document.getElementById(
                    'funds-investments-table-toolbar'
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
                    'funds-investments-table-searchbox'
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
                    'funds-investments-table-pagination'
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
        
        reset: function (fund) {
            this.fund = fund;
            this.parentId = fund.id;
            this.collection.reset(fund.get('investments'));
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #funds-investments-table-toolbar [data-action="read"]': 'read',
            'click #funds-investments-table-toolbar [data-action="export"]': 'export'
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
            var fund = this.fund;
            var fundId = fund.id;
            $.ajax({
                url: App.url('investments/export'),
                data: {
                    where: {
                        'offering_id IN': _.pluck(fund.get('offerings'), 'id')
                    }
                },
                success: function (content) {
                    _.forceDownload(
                        content,
                        'fund-' + fundId + '-investments.csv',
                        'text/csv; charset=UTF-8'
                    );
                },
            });
        },
        
    });
    
    App.Funds.InvestmentsPanel = FundsInvestmentsPanel;
     
}(App));
