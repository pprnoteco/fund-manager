/*
 |------------------------------------------------------------------------
 | App\Users\Profile: Read
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
            created: function (date) {
                return moment(date).fromNow(true);
            },
            'modified': Profile.formats.date,
        }
        
    });
    
    App.Users.ReadProfile = ReadProfile;
    
}(App));
