<!-- Template\Element\Transactions\Profile: Read
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'transactions';
?>

<table class="table table-sm profile" id="<?= $slug ?>-read-profile">
    <tbody>
        
        <tr>
            <th colspan="3">Investment id</th>
            <td colspan="9">
                <span data-field="investment_id"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Date</th>
            <td colspan="9">
                <span data-field="date"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Amount</th>
            <td colspan="9">
                <span data-field="amount"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Type</th>
            <td colspan="9">
                <span data-field="type"></span>
            </td>
        </tr>
        
    </tbody>
</table>
