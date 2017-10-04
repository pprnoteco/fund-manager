<!-- Template\Element\Users\Profile: Read
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'users';
?>

<table class="table table-sm profile" id="<?= $slug ?>-read-profile">
    <tbody>
        
        <tr>
            <th colspan="3">Username</th>
            <td colspan="9">
                <span data-field="username"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Password</th>
            <td colspan="9">
                <span data-field="password"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Role</th>
            <td colspan="9">
                <span data-field="role"></span>
            </td>
        </tr>
        
    </tbody>
</table>
