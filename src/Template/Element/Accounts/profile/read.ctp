<!-- Template\Element\Accounts\Profile: Read
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'accounts';
?>

<table class="table table-sm profile" id="<?= $slug ?>-read-profile">
    <tbody>
        
        <tr>
            <th colspan="3">Name</th>
            <td colspan="9">
                <span data-field="name"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Type</th>
            <td colspan="3">
                <span data-field="type"></span>
            </td>
            <th colspan="3">Created</th>
            <td colspan="3">
                <span data-field="created"></span> by
                <span data-field="created_by"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Id</th>
            <td colspan="3">
                <span data-field="id"></span>
            </td>
            <th colspan="3">Modifed</th>
            <td colspan="3">
                <span data-field="modified"></span> by
                <span data-field="modified_by"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Investments amount</th>
            <td colspan="3">
                <span data-field="investments_amount"></span>
            </td>
            <th colspan="3">Address</th>
            <td colspan="3">
                <span data-field="address"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Investments balance</th>
            <td colspan="3">
                <span data-field="investments_balance"></span>
            </td>
            <th colspan="3">City, State, Zip</th>
            <td colspan="3">
                <span data-field="city_state_zip"></span>
            </td>
        </tr>
        
    </tbody>
</table>
