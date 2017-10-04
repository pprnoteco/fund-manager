<!-- Template\Element\<%= ucfirst($pluralVar) %>\Form: Create
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : '<%= $slug %>';
$type = isset($type) ? $type : 'create';
$prefix = $slug . '-' . $type;
?>

<form id="<?= $prefix ?>-form">
    
<% foreach($fields as $field):
$skip = ['id', 'created', 'modified', 'created_by_id', 'modified_by_id'];
if (in_array($field, $skip)) continue;
$title = ucfirst(str_replace('_', ' ', $field));
%>
    <div class="form-group">
        <label for="<?= $prefix ?>-<%= $field %>"><%= $title %></label>
        <input type="text"
               class="form-control"
               id="<?= $prefix ?>-<%= $field %>"
               name="<%= $field %>"
               placeholder="<%= $title %>">
    </div>
            
<% endforeach %>
</form>
