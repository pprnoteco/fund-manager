/*
 |------------------------------------------------------------------------
 | App\Comments: Table
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
            created_by: function (model) {
                if (!model) return 'Anonymous';
                return model.username.split('@')[0];
            },
            modified_by: function () {
                
            },
            created: Table.formats.date,
            modified: Table.formats.date,
        }
        
    });
    
    App.Comments.Table = CommentsTable;
    
}(App));
