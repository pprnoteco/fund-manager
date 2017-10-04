/*
 |------------------------------------------------------------------------
 | App\Users\View: Login
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Users = App.Users;
    var View = Users.View;
    var Model = Users.Model;
    var Form = Users.LoginForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var LoginView = View.extend({
        
        form: undefined,
        alertElement: 'users-login-form-alert',
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new Form({
                el: document.getElementById('users-login-form'),
                model: this.model
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.form.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var self = this;
            var form = this.form;
            var alert = this.alert;
            
            function success (url) {
                events('off');
                self.loading(false);
                window.location = App.url();
            }
            
            function error (message) {
                events('off');
                self.loading(false);
                alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('success', success);
                form[toggle]('error', error);
            }
            
            events('on');
            this.loading(true);
            alert.clear();
            form.submit();
        },
        
    });
    
    App.Users.views.Login = LoginView;
    
}(App));
