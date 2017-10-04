/*
 |------------------------------------------------------------------------
 | App\<%= $modelClass %>\Profile: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadProfile = Profile.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
<% 
foreach($columns as $field => $column):
    $format = null;
    $type = $column['type'];
    if ($type == 'date' || $type == 'datetime' || $type == 'timestamp') {
        $format = 'date';
    }
    if ($type == 'decimal') {
        if ($column['length'] == 15 && $column['precision'] == 2) {
            $format = 'currency';
        }
    }
    if (!$format) continue;
%>
            '<%= $field %>': Profile.formats.<%= $format %>,
<% endforeach %>
        }
        
    });
    
    App.<%= $modelClass %>.ReadProfile = ReadProfile;
    
}(App));
