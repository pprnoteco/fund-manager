<!-- Template\Element\Statements: Table
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'statements';
?>

<table class="table table-bordered table-striped table-hover" id="<?= $slug ?>-table">
    
    <thead>
        <tr>
            <th data-field="type"
                data-cell-class="text-center">Type</th>
            <th data-field="correct"
                data-cell-class="text-center">Sync</th>
            <th data-field="name">Name</th>
            <th data-field="date">Date</th>
            <th data-field="size">Size</th>
        </tr>    
    </thead>
    
    <tbody></tbody>
    
    <tfoot></tfoot>
    
</table>
