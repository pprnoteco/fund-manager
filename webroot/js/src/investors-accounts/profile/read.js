/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts\Profile: Read
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
        }
        
    });
    
    App.InvestorsAccounts.ReadProfile = ReadProfile;
    
}(App));