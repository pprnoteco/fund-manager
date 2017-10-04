/*
 |------------------------------------------------------------------------
 | App\Investments\Modal: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investments = App.Investments;
    var Modal = App.Modal;
    var Profile = Investments.DeleteProfile;
    
    var DeleteModal = Modal.extend({
        
        profile: undefined,
        profileId: 'investments-delete-profile',
        alertElement: 'investments-delete-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.profileId) {
                this.profileId = options.profileId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById(this.profileId)
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
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var model = this.model;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                var message;
                if (options && options.textStatus) {
                    message = options.textStatus;
                } else {
                    message = 'An unexpected error occured';
                }
                modal.loading(false);
                modal.alert.set(message);
            }
            
            this.loading(true);
            model.destroy({
                wait: true,
                error: error,
                success: success,
            });
        },
        
    });
    
    App.Investments.DeleteModal = DeleteModal;
    
}(App));
