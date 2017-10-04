/*
 |------------------------------------------------------------------------
 | App\Offerings\Profile: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var DeleteProfile = Profile.extend({
        
        formats: {
            rate: function (value) {
                value || (value = 0);
                return value.toFixed(3) + '%';
            },
        }
        
    });
    
    App.Offerings.DeleteProfile = DeleteProfile;
    
}(App));
