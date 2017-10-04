<!-- Template\Element\<%= ucfirst($pluralVar) %>: Table
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : '<%= $slug %>';
?>

<table class="table table-bordered table-striped table-hover" id="<?= $slug ?>-table">
    
    <thead>
        <tr>
<% foreach($fields as $field):
    $title = ucfirst(str_replace('_', ' ', $field));
    $hidden = [
       'id',
       'created',
       'modified',
       'created_by_id',
       'modified_by_id',
       'address',
       'city',
       'state',
       'zip'
    ];
    $visible = in_array($field, $hidden) ? 'false' : 'true';
%>
            <th data-field="<%= $field %>" 
                data-visible="<%= $visible %>"<%= $visible == 'false' ? "\n                class=\"d-none\"" : '' %>>
                <%= $title . "\n" %>
            </th>
<% endforeach %>
        </tr>    
    </thead>
    
    <tbody></tbody>
    
    <tfoot></tfoot>
    
</table>
