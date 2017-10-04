/*
 |------------------------------------------------------------------------
 | App\Accounts\Table: Comments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var CommentsTable = Table.extend({
        
        emptyMessage: 'No comments found',
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            created: Table.formats.date,
            modified: Table.formats.date,
            created_by: Table.formats.createdBy,
        }
        
    });
    
    App.Accounts.CommentsTable = CommentsTable;
    
}(App));
