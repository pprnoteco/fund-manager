<!-- Template\Element\Offerings\Profile: Delete
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'offerings';
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
                <th>Class / Rate</th>
                <td>
                    <span data-field="class"></span> / <span data-field="rate"></span>
                </td>
            </tr>
        </tbody>
    </table>
    
</div>
