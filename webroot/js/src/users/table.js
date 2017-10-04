/*
 |------------------------------------------------------------------------
 | App\Users: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    var roles = [
        'Read only',
        'User',
        'Admin',
        'Super admin'
    ];
    
    var UsersTable = Table.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            role: function (role) {
                return roles[role];
            },
            active: function (bool) {
                var span = document.createElement('span');
                if (bool) {
                    span.className = 'fa fa-check text-success';
                } else {
                    span.className = 'fa fa-times text-danger';
                }
                return span;
            },
            locked: function (bool) {
                var span = document.createElement('span');
                if (bool) {
                    span.className = 'fa fa-lock text-danger';
                } else {
                    span.className = 'fa fa-unlock text-success';
                }
                return span;
            }
        }
        
    });
    
    App.Users.Table = UsersTable;
    
}(App));
