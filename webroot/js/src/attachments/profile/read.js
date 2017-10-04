/*
 |------------------------------------------------------------------------
 | App\Attachments\Profile: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadProfile = Profile.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            'created': Profile.formats.date,
            'modified': Profile.formats.date,
        }
        
    });
    
    App.Attachments.ReadProfile = ReadProfile;
    
}(App));
