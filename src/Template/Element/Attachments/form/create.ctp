<!-- Template\Element\Attachments\Form: Create
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'attachments';
$type = isset($type) ? $type : 'create';
$prefix = $slug . '-' . $type;
?>

<form id="<?= $prefix ?>-form">
    
    <input type="hidden" name="parent" data-field="parent">
    <input type="hidden" name="parent_id" data-field="parent_id">
    
    <label class="custom-file" style="width: 100%">
        <input type="file" name="file" data-field="file" class="custom-file-input">
        <span class="custom-file-control"></span>
    </label>
            
</form>
