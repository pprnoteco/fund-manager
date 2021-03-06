/*
 |------------------------------------------------------------------------
 | App\Statements\Profile: Read
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
    
    App.Statements.ReadProfile = ReadProfile;
    
}(App));
