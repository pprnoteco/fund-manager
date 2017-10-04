/*
 |------------------------------------------------------------------------
 | App\Comments\Modal: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Comments = App.Comments;
    var Modal = App.Modal;
    var Profile = Comments.ReadProfile;
    
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
                el: document.getElementById('comments-read-profile')
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
    
    App.Comments.ReadModal = ReadModal;
    
}(App));
