<!-- Template\Element\Funds\Profile: Read
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'funds';
?>

<table class="table table-sm profile" id="<?= $slug ?>-read-profile">
    <tbody>
        
        <tr>
            <th colspan="3">Id</th>
            <td colspan="3">
                <span data-field="id"></span>
            </td>
            <th colspan="3">Created</th>
            <td colspan="3">
                <span data-field="created"></span> by
                <span data-field="created_by"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Name</th>
            <td colspan="3">
                <span data-field="name"></span>
            </td>
            <th colspan="3">Modified</th>
            <td colspan="3">
                <span data-field="modified"></span> by
                <span data-field="modified_by"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Address</th>
            <td colspan="3">
                <span data-field="address"></span>
            </td>
            <th colspan="3">Investments amount</th>
            <td colspan="3">
                <span data-field="investments_amount"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">City, State, Zip</th>
            <td colspan="3">
                <span data-field="city"></span>,
                <span data-field="state"></span>
                <span data-field="zip"></span>
            </td>
            <th colspan="3">Investments balance</th>
            <td colspan="3">
                <span data-field="investments_balance"></span>
            </td>
        </tr>
        
    </tbody>
</table>
