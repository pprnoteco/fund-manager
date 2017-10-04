/*
 |------------------------------------------------------------------------
 | App\Users\View: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Users = App.Users;
    var View = Users.View;
    var Form = Users.CreateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateView = View.extend({
        
        alertElement: 'users-create-form-alert',
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initElement();
            this.initModel();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $submit = this.$el.find('[data-action="submit"]');
            this.$submit = $submit;
            this.$submitIcon = $submit.find('.fa');
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize model
         |----------------------------------------------------------------
         */
        
        initModel: function () {
            var model = this.model;
            model.validate = function (attrs) {
                if (!attrs.username) {
                    return "Please provide an email address";
                }
                if (!attrs.password) {
                    return "Please provide a password";
                }
                if (!attrs.password2) {
                    return "Please confirm your password";
                }
                if (attrs.password !== attrs.password2) {
                    return "The passwords you entered do not match";
                }
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new Form({
                model: this.model,
                el: document.getElementById('users-create-form')
            });
            this.form = form;
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
            'click [data-action="submit"]': 'submit'
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
            var model = this.model;
            
            function success (url) {
                events('off');
                self.loading(false);
                window.location = App.url('verify-email-sent/' + model.get('token'));
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
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-user-plus');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-user-plus');
        },
        
    });
    
    App.Users.views.Create = CreateView;
    
}(App));
