/*
 |------------------------------------------------------------------------
 | App\Attachments: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var AttachmentsTable = Table.extend({
        
        emptyMessage: 'No attachments found',
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            mime: Table.formats.mime,
            size: Table.formats.size,
            created: Table.formats.date,
            modified: Table.formats.date,
            created_by: Table.formats.createdBy,
        }
        
    });
    
    App.Attachments.Table = AttachmentsTable;
    
}(App));
