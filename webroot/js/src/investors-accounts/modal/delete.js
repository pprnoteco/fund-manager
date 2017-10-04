/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts\Modal: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var InvestorsAccounts = App.InvestorsAccounts;
    var Modal = App.Modal;
    var Profile = InvestorsAccounts.DeleteProfile;
    
    var DeleteModal = Modal.extend({
        
        alertElement: 'investors-accounts-delete-modal-alert',
        
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
                el: document.getElementById('investors-accounts-delete-profile')
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
            this.alert.clear();
            
            function success (model) {
                modal.loading(false);
                modal.trigger('success', model);
                modal.close();
            }
            
            function error (message) {
                modal.loading(false);
                modal.alert.set(message);
            }
            
            this.loading(true);
            model.destroy({
                error: error,
                success: success,
            });
        },
        
    });
    
    App.InvestorsAccounts.DeleteModal = DeleteModal;
    
}(App));
