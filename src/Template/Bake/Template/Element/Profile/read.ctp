<!-- Template\Element\<%= ucfirst($pluralVar) %>\Profile: Read
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : '<%= $pluralVar %>';
?>

<table class="table table-sm profile" id="<?= $slug ?>-read-profile">
    <tbody>
        
<% foreach($fields as $field):
$skip = [ 'id', 'created', 'modified', 'created_by_id', 'modified_by_id' ];
if (in_array($field, $skip)) continue;
$title = ucfirst(str_replace('_', ' ', $field));
%>
        <tr>
            <th colspan="3"><%= $title %></th>
            <td colspan="9">
                <span data-field="<%= $field %>"></span>
            </td>
        </tr>
        
<% endforeach %>
    </tbody>
</table>
