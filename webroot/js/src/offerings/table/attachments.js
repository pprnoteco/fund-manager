/*
 |------------------------------------------------------------------------
 | App\Offerings\Table: Attachments
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
    
    App.Offerings.AttachmentsTable = AttachmentsTable;
    
}(App));
