/*
 |------------------------------------------------------------------------
 | App\Users\Form: Login
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var LoginForm = Form.extend({
        
        $submit: undefined,
        $submitIcon: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initElement();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$submitIcon = $submitIcon;
            
            $submit.on('mouseover', function () {
                $submitIcon.removeClass('fa-lock');
                $submitIcon.addClass('fa-unlock');
            });
            
            $submit.on('mouseout', function () {
                $submitIcon.removeClass('fa-unlock');
                $submitIcon.addClass('fa-lock');
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var form = this;
            var model = this.toModel();
            var error = this.validate(model.attributes);
            if (error) {
                this.trigger('error', error);
                return;
            }
            this.loading(true);
            $.ajax({
                url: App.url('login') + '.json',
                type: 'post',
                dataType: 'json',
                data: {
                    username: model.get('username'),
                    password: model.get('password')
                },
                success: function (response) {
                    form.loading(false);
                    if (!response.success) {
                        form.trigger('error', response.error);
                    } else {
                        form.trigger('success', response.redirect);
                    }
                },
                error: function () {
                    form.loading(false);
                    form.trigger('error', 'An unexpected error occured');
                }
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function (attrs) {
            if (!attrs.username) {
                return 'Please provide a username';
            }
            if (!attrs.password) {
                return 'Please provide a password';
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-lock');
            this.$submitIcon.removeClass('fa-unlock');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-lock');
        },
        
    });
    
    App.Users.LoginForm = LoginForm;
    
}(App));
