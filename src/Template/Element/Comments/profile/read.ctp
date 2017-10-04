<!-- Template\Element\Comments\Profile: Read
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'comments';
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
            <th colspan="3">Content</th>
            <td colspan="9">
                <span data-field="content"></span>
            </td>
        </tr>
        
    </tbody>
</table>
