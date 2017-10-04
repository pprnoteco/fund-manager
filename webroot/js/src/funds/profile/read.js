/*
 |------------------------------------------------------------------------
 | App\Funds\Profile: Read
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
            investments_amount: Profile.formats.currency,
            investments_balance: Profile.formats.currency,
            created: Profile.formats.date,
            modified: function (date) {
                if (!date) return 'N/A';
                return moment(date).fromNow();
            },
            created_by: Profile.formats.createdBy,
            modified_by: Profile.formats.modifiedBy,
        }
        
    });
    
    App.Funds.ReadProfile = ReadProfile;
    
}(App));
