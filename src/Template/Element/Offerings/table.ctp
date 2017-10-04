<!-- Template\Element\Offerings: Table
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'offerings';
?>

<table class="table table-bordered table-striped table-hover" id="<?= $slug ?>-table">
    
    <thead>
        <tr>
            <th data-field="id" 
                data-visible="false">
                Id
            </th>
            <th data-field="fund_id" 
                data-visible="false">
                Fund id
            </th>
            <th data-field="date" 
                data-visible="true">
                Date
            </th>
            <th data-field="class" 
                data-visible="true">
                Class
            </th>
            <th data-field="rate" 
                data-visible="true">
                Rate
            </th>
            <th data-field="capacity" 
                data-visible="true">
                Capacity
            </th>
            <th data-field="investments_count" 
                data-visible="true">
                Investments count
            </th>
            <th data-field="investments_amount" 
                data-visible="true">
                Investments amount
            </th>
            <th data-field="investments_balance" 
                data-visible="true">
                Investments balance
            </th>
            <th data-field="created" 
                data-visible="false"
                class="d-none">
                Created
            </th>
            <th data-field="modified" 
                data-visible="false"
                class="d-none">
                Modified
            </th>
            <th data-field="created_by_id" 
                data-visible="false"
                class="d-none">
                Created by id
            </th>
            <th data-field="modified_by_id" 
                data-visible="false"
                class="d-none">
                Modified by id
            </th>
        </tr>    
    </thead>
    
    <tbody></tbody>
    
    <tfoot></tfoot>
    
</table>
