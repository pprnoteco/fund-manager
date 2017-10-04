<!-- Template\Element\<%= $modelClass %>\Profile: Import
-------------------------------------------------------------------------->

<table class="table table-sm">
    <thead>
        <tr>
            <th>Field</th>
            <th>Description</th>
            <th class="text-center">Required</th>
        </tr>
    </thead>
    <tbody>
        
<% foreach($fields as $field):
$skip = [ 'created', 'modified', 'created_by_id', 'modified_by_id' ];
if (in_array($field, $skip)) continue;
$title = ucfirst(str_replace('_', ' ', $field));
%>
        <tr>
            <td><%= $field %></td>
            <td><%= $title %></td>
            <td class="text-center">
                <span class="fa fa-check text-success"></span>
            </td>
        </tr>
        
<% endforeach %>
    </tbody>
</table>
