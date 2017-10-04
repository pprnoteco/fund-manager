<!-- Template\Element\Statements\Profile: Read
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'statements';
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
            <th colspan="3">Name</th>
            <td colspan="9">
                <span data-field="name"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Path</th>
            <td colspan="9">
                <span data-field="path"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Type</th>
            <td colspan="9">
                <span data-field="type"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Size</th>
            <td colspan="9">
                <span data-field="size"></span>
            </td>
        </tr>
        
    </tbody>
</table>
