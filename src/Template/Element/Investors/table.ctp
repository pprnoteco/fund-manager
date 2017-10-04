<!-- Template\Element\Investors: Table
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'investors';
?>

<table class="table table-bordered table-striped table-hover" id="<?= $slug ?>-table">
    
    <thead>
        <tr>
            <th data-field="id" 
                data-visible="false"
                class="d-none">
                Id
            </th>
            <th data-field="name" 
                data-visible="true">
                Name
            </th>
            <th data-field="ftp_folder" 
                data-visible="true">
                Ftp folder
            </th>
            <th data-field="address" 
                data-visible="false"
                class="d-none">
                Address
            </th>
            <th data-field="city" 
                data-visible="false"
                class="d-none">
                City
            </th>
            <th data-field="state" 
                data-visible="false"
                class="d-none">
                State
            </th>
            <th data-field="zip" 
                data-visible="false"
                class="d-none">
                Zip
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
