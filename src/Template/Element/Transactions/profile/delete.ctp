<!-- Template\Element\Transactions\Profile: Delete
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'transactions';
?>

<div id="<?= $slug ?>-delete-profile">
    
    Are you sure you wish to delete the following record?
    
    <table class="table table-sm" style="margin-top: 20px;">
        <tbody>
            <tr>
                <th>ID</th>
                <td>
                    <span data-field="id"></span>
                </td>
            </tr>
            <tr>
                <th>Name</th>
                <td>
                    <span data-field="name"></span>
                </td>
            </tr>
        </tbody>
    </table>
    
</div>
