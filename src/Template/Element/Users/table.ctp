<!-- Template\Element\Users: Table
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'users';
?>

<table class="table table-bordered table-striped table-hover" id="<?= $slug ?>-table">
    
    <thead>
        <tr>
            <th data-field="username" 
                data-visible="true">
                Username
            </th>
            <th data-field="role" 
                data-visible="true">
                Role
            </th>
            <th data-field="active" 
                data-cell-class="text-center">
                <span class="fa fa-envelope-o"></span>
            </th>
            <th data-field="locked" 
                data-cell-class="text-center">
                <span class="fa fa-lock"></span>
            </th>
        </tr>    
    </thead>
    
    <tbody></tbody>
    
    <tfoot></tfoot>
    
</table>
