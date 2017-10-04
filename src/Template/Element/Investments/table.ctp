<!-- Template\Element\Investments: Table
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'investments';
?>

<table class="table table-bordered table-striped table-hover" id="<?= $slug ?>-table">
    
    <thead>
        <tr>
            <th data-field="id" 
                data-visible="false">
                Id
            </th>
            <th data-field="client_id" 
                data-visible="true">
                Client id
            </th>
            <th data-field="status" 
                data-visible="true">
                Status
            </th>
            <th data-field="fund.name" 
                data-visible="true">
                Fund
            </th>
            <th data-field="account.name" 
                data-visible="true">
                Account
            </th>
            <th data-field="date" 
                data-visible="true">
                Date
            </th>
            <th data-field="amount" 
                data-visible="false">
                Amount
            </th>
            <th data-field="term" 
                data-visible="false">
                Term
            </th>
            <th data-field="balance" 
                data-visible="true">
                Balance
            </th>
            <th data-field="preferred_payment" 
                data-visible="false">
                Preferred payment
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
