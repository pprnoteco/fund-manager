<!-- Template\Element\Attachments\Profile: Read
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'attachments';
?>

<table class="table table-sm profile" id="<?= $slug ?>-read-profile">
    <tbody>
        
        <tr>
            <th colspan="3">Parent</th>
            <td colspan="9">
                <span data-field="parent"></span>
            </td>
        </tr>
        
        <tr>
            <th colspan="3">Parent id</th>
            <td colspan="9">
                <span data-field="parent_id"></span>
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
            <th colspan="3">Mime</th>
            <td colspan="9">
                <span data-field="mime"></span>
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
