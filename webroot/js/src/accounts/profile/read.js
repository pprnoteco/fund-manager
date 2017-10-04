/*
 |------------------------------------------------------------------------
 | App\Accounts\Profile: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;
    
    var accountTypes = [
        null,
        'Personal',
        'Business',
        'IRA',
        '401K',
        'Other'
    ];
    
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
            type: function (value) {
                value || (value = 5);
                return accountTypes[value];
            },
            address: function (valule) {
                return valule ? valule : 'N/A';
            },
            city_state_zip: function (value) {
                var city = this.get('city');
                var state = this.get('state');
                var zip = this.get('zip');
                if (!city && !state && !zip) {
                    return 'N/A';
                }
                if (city && !state && !zip) {
                    return city;
                }
                if (city && state && !zip) {
                    return city + ', ' + state;
                }
                if (city && state && zip) {
                    return city + ', ' + state + ' ' + zip;
                }
                if (!city && state && !zip) {
                    return state;
                }
                if (!city && state && zip) {
                    return state + ' ' + zip;
                }
                if (!city && !state && zip) {
                    return zip;
                }
            },
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
    
    App.Accounts.ReadProfile = ReadProfile;
    
}(App));
