/*
 |------------------------------------------------------------------------
 | App\Statements: Table
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
            correct: function (value) {
                var span = document.createElement('span');
                if (value) {
                    span.className = 'fa fa-check text-success';
                } else {
                    span.className = 'fa fa-times text-danger';
                }
                return span;
            },
            date: Table.formats.date,
            size: Table.formats.size
        }
        
    });
    
    App.Statements.Table = StatementsTable;
    
}(App));
