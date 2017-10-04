<!-- Template\Element\Offerings\Profile: Read
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'offerings';
?>

<table class="table table-sm profile" id="<?= $slug ?>-read-profile">
    <tbody>
        
        <tr>
            <th colspan="3">Id</th>
            <td colspan="3">
                <span data-field="fund_id"></span>
            </td>
            <th colspan="3">Created</th>
            <td colspan="3">
                <span data-field="created"></span> by
                <span data-field="created_by"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Opened</th>
            <td colspan="3">
                <span data-field="date"></span>
            </td>
            <th colspan="3">Modified</th>
            <td colspan="3">
                <span data-field="modified"></span> by
                <span data-field="modified_by"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Class</th>
            <td colspan="3">
                <span data-field="class"></span>
            </td>
            <th colspan="3">Rate</th>
            <td colspan="3">
                <span data-field="rate"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Investments count</th>
            <td colspan="3">
                <span data-field="investments_count"></span>
            </td>
            <th colspan="3">Capacity</th>
            <td colspan="3">
                <span data-field="capacity"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Investments amount</th>
            <td colspan="3">
                <span data-field="investments_amount"></span>
            </td>
            <th colspan="3">Investments balance</th>
            <td colspan="3">
                <span data-field="investments_balance"></span>
            </td>
        </tr>
        
    </tbody>
</table>
