<!-- Template\Element\Comments\Form: Create
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'comments';
$type = isset($type) ? $type : 'create';
$prefix = $slug . '-' . $type;
?>

<form id="<?= $prefix ?>-form">
    
    <input type="hidden" name="parent">
    <input type="hidden" name="parent_id">
            
    <div class="form-group">
        <label class="sr-only" for="<?= $prefix ?>-content">Content</label>
        <textarea class="form-control" 
                  name="content"
                  data-field="content"
                  id="<?= $prefix ?>-content" 
                  rows="7"
                  placeholder="Enter comment here..."></textarea>
    </div>
            
</form>
