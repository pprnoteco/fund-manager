<!-- Template\Element\Comments: Table
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'comments';
?>

<table class="table table-bordered table-striped table-hover" id="<?= $slug ?>-table">
    
    <thead>
        <tr>
            <th data-field="created_by" 
                data-visible="true">
                User
            </th>
            <th data-field="content" 
                data-visible="true">
                Comment
            </th>
            <th data-field="created" 
                data-visible="true">
                Date
            </th>
        </tr>
    </thead>
    
    <tbody></tbody>
    
    <tfoot></tfoot>
    
</table>
