/*
 |------------------------------------------------------------------------
 | App\Users\View: Verfiy email sent
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
    
    var VerifyEmailSentView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.$resend = this.$el.find('[data-action="resend"]');
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
            'click [data-action="resend"]': 'resend',
        },
        
        /*
         |----------------------------------------------------------------
         | Resend
         |----------------------------------------------------------------
         */
        
        resend: function () {
            if (this.isLoading()) return;
            var self = this;
            var model = this.model;
            this.loading(true);
            $.ajax({
                url: App.url('verify-email-resend/' + model.get('token') + '.json'),
                complete: function () {
                    self.loading(false);
                },
            });
        },
        
        loadingStateOn: function () {
            var span = document.createElement('span');
            span.className = 'fa fa-spinner fa-pulse';
            this.$resend.prepend(span);
        },
        
        loadingStateOff: function () {
            this.$resend.find('.fa').remove();
        }
        
    });
    
    App.Users.views.VerifyEmailSent = VerifyEmailSentView;
    
}(App));
