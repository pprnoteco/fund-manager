/*
 |------------------------------------------------------------------------
 | App\Users: Toolbar
 |------------------------------------------------------------------------
 */

(function(App){

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Toolbar = App.Toolbar.extend({
     
        /*
         |----------------------------------------------------------------
         | Constructor
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            var $elem = this.$el;
            $read = $elem.find('[data-action="read"]');
            $resetPassword = $elem.find('[data-action="reset-password"]');
            $changeRole = $elem.find('[data-action="change-role"]');
            $lock = $elem.find('[data-action="lock"]');
            $unlock = $elem.find('[data-action="unlock"]');
            
            this.$resetPassword = $resetPassword;
            this.$changeRole = $changeRole;
            this.$lock = $lock;
            this.$unlock = $unlock;
        },
     
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var value = !this.model;
            this.$resetPassword.prop('disabled', value);
            this.$changeRole.prop('disabled', value);
            this.$lock.prop('disabled', value);
            this.$unlock.prop('disabled', value);
        }
        
    });
    
    App.Users.Toolbar = Toolbar;
    
}(App));
