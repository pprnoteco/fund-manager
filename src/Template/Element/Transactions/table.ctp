<!-- Template\Element\Transactions: Table
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'transactions';
?>

<table class="table table-bordered table-striped table-hover" id="<?= $slug ?>-table">
    
    <thead>
        <tr>
            <th data-field="id" 
                data-visible="false">
                Id
            </th>
            <th data-field="investment_id" 
                data-visible="false">
                Investment id
            </th>
            <th data-field="date" 
                data-visible="true">
                Date
            </th>
            <th data-field="amount" 
                data-visible="true">
                Amount
            </th>
            <th data-field="type" 
                data-visible="true">
                Type
            </th>
            <th data-field="created" 
                data-visible="false">
                Created
            </th>
            <th data-field="modified" 
                data-visible="false">
                Modified
            </th>
            <th data-field="created_by_id" 
                data-visible="false">
                Created by id
            </th>
            <th data-field="modified_by_id" 
                data-visible="false">
                Modified by id
            </th>
        </tr>    
    </thead>
    
    <tbody></tbody>
    
    <tfoot></tfoot>
    
</table>
