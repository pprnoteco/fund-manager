<!-- Template\Element\Investments\Profile: Read
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'investments';
?>

<table class="table table-sm profile" id="<?= $slug ?>-read-profile">
    <tbody>
        
        <tr>
            <th colspan="3">Client id</th>
            <td colspan="3">
                <span data-field="client_id"></span>
            </td>
            <th colspan="3">Id</th>
            <td colspan="3">
                <span data-field="id"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Fund</th>
            <td colspan="3">
                <span data-field="fund"></span>
            </td>
            <th colspan="3">Offering</th>
            <td colspan="3">
                <span data-field="offering"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Investor</th>
            <td colspan="3">
                <span data-field="investor"></span>
            </td>
            <th colspan="3">Account</th>
            <td colspan="3">
                <span data-field="account"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Date</th>
            <td colspan="3">
                <span data-field="date"></span>
            </td>
            <th colspan="3">Status</th>
            <td colspan="3">
                <span data-field="status"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Amount</th>
            <td colspan="3">
                <span data-field="amount"></span>
            </td>
            <th colspan="3">Balance</th>
            <td colspan="3">
                <span data-field="balance"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Term</th>
            <td colspan="3">
                <span data-field="term"></span>
            </td>
            <th colspan="3">Preferred payment</th>
            <td colspan="3">
                <span data-field="preferred_payment"></span>
            </td>
        </tr>
        
    </tbody>
</table>
