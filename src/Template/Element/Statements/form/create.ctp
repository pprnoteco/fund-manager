<!-- Template\Element\Statements\Form: Create
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'statements';
$type = isset($type) ? $type : 'create';
$prefix = $slug . '-' . $type;
?>

<form id="<?= $prefix ?>-form">
    
    <div class="form-group">
        <label for="<?= $prefix ?>-investment_id">Investment id</label>
        <input type="text"
               class="form-control"
               id="<?= $prefix ?>-investment_id"
               name="investment_id"
               placeholder="Investment id">
    </div>
            
    <div class="form-group">
        <label for="<?= $prefix ?>-name">Name</label>
        <input type="text"
               class="form-control"
               id="<?= $prefix ?>-name"
               name="name"
               placeholder="Name">
    </div>
            
    <div class="form-group">
        <label for="<?= $prefix ?>-path">Path</label>
        <input type="text"
               class="form-control"
               id="<?= $prefix ?>-path"
               name="path"
               placeholder="Path">
    </div>
            
    <div class="form-group">
        <label for="<?= $prefix ?>-type">Type</label>
        <input type="text"
               class="form-control"
               id="<?= $prefix ?>-type"
               name="type"
               placeholder="Type">
    </div>
            
    <div class="form-group">
        <label for="<?= $prefix ?>-size">Size</label>
        <input type="text"
               class="form-control"
               id="<?= $prefix ?>-size"
               name="size"
               placeholder="Size">
    </div>
            
</form>
