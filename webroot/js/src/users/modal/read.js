/*
 |------------------------------------------------------------------------
 | App\Users\Modal: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Users = App.Users;
    var Modal = App.Modal;
    var Profile = Users.ReadProfile;
    
    var ReadModal = Modal.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('users-read-profile')
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="close"]': 'close',
            'click [data-action="update"]': 'update',
        },
        
        /*
         |----------------------------------------------------------------
         | Update
         |----------------------------------------------------------------
         */
        
        update: function () {
            this.close();
            this.trigger('update', this.model);
        },
        
    });
    
    App.Users.ReadModal = ReadModal;
    
}(App));
