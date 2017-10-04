<!-- Template\Element\Attachments: Table
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'attachments';
?>

<table class="table table-bordered table-striped table-hover" id="<?= $slug ?>-table">
    
    <thead>
        <tr>
            <th data-field="mime" 
                data-visible="true"
                data-cell-class="text-center">
                Type
            </th>
            <th data-field="name" 
                data-visible="true">
                Name
            </th>
            <th data-field="size" 
                data-visible="true">
                Size
            </th>
            <th data-field="created" 
                data-visible="true">
                Date
            </th>
            <th data-field="created_by" 
                data-visible="true">
                Uploaded by
            </th>
        </tr>    
    </thead>
    
    <tbody></tbody>
    
    <tfoot></tfoot>
    
</table>
