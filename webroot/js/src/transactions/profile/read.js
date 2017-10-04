/*
 |------------------------------------------------------------------------
 | App\Transactions\Profile: Read
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
            'date': Profile.formats.date,
            'amount': Profile.formats.currency,
            'created': Profile.formats.date,
            'modified': Profile.formats.date,
        }
        
    });
    
    App.Transactions.ReadProfile = ReadProfile;
    
}(App));
