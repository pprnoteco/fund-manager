/*
 |------------------------------------------------------------------------
 | App\Users\View: Forgot password
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Users = App.Users;
    var View = Users.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ForgotPasswordView = View.extend({
        
        alertElement: 'users-forgot-password-form-alert',
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #users-forgot-password-form [data-action="submit"]': 'submit',
        },
        
        submit: function () {
            if (this.isLoading()) return;
            var self = this;
            var model = this.model;
            this.loading(true);
            $.ajax({
                url: App.url('verify-email-resend/' + model.get('token') + '.json'),
                complete: function () {
                    self.loading(true);
                },
            });
        },
        
    });
    
    App.Users.views.ForgotPassword = ForgotPasswordView;
    
}(App));
