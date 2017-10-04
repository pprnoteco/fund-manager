/*
 |------------------------------------------------------------------------
 | App\Offerings\Profile: Read
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
            date: Profile.formats.date,
            rate: function (value) {
                value || (value = 0);
                return value.toFixed(3) + '%';
            },
            capacity: Profile.formats.currency,
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
    
    App.Offerings.ReadProfile = ReadProfile;
    
}(App));
