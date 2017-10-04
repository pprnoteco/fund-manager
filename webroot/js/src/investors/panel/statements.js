/*
 |------------------------------------------------------------------------
 | App\Investors\Panel: Statements
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
    
    var InvestorsStatementsPanel = View.extend({
        
        investor: undefined,
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
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function (options) {
            var Table = App.Investors.StatementsTable;
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            var table = new Table({
                el: document.getElementById('investors-statements-table'),
                collection: this.collection,
                searchbox: searchbox,
                pagination: pagination
            });
            
            table.on('dblclick', function (model) {
                window.open(App.url('statements/view/' + model.id), '_blank').focus();
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById(
                    'investors-statements-table-searchbox'
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
                    'investors-statements-table-pagination'
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
        
        reset: function (investor) {
            this.investor = investor;
            this.collection.reset(investor.get('statements'));
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Investors.StatementsPanel = InvestorsStatementsPanel;
     
}(App));
