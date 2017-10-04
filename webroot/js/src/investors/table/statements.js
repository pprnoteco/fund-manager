/*
 |------------------------------------------------------------------------
 | App\Investors\Table: Statements
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var StatementsTable = Table.extend({
        
        emptyMessage: 'No statements found',
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            type: function () {
                var span = document.createElement('span');
                span.className = 'fa fa-file-pdf-o';
                return span;
            },
            size: Table.formats.size
        }
        
    });
    
    App.Investors.StatementsTable = StatementsTable;
    
}(App));
