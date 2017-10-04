<!-- Template\Element\Offerings\Form: Create
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'offerings';
$type = isset($type) ? $type : 'create';
$prefix = $slug . '-' . $type;
?>

<form id="<?= $prefix ?>-form">
    
    <input type="hidden" name="fund_id">
    
    <!-- Class -->
    
    <div class="form-group">
        <label for="<?= $prefix ?>-date">Date</label>
        <input type="date"
               class="form-control"
               name="date"
               data-field="date"
               id="<?= $prefix ?>-date"
               placeholder="Date">
    </div>
    
    <!-- Class -->
    
    <div class="form-group">
        <label for="<?= $prefix ?>-class">Class</label>
        <input type="text"
               class="form-control"
               name="class"
               data-field="class"
               id="<?= $prefix ?>-class"
               placeholder="Class">
    </div>
    
    <!-- Rate -->
    
    <div class="form-group">
        <label for="<?= $prefix ?>-rate">Rate</label>
        <div class="input-group">
            <span class="input-group-addon">%</span>
            <input type="number"
                   class="form-control"
                   name="rate"
                   data-field="rate"
                   id="<?= $prefix ?>-rate"
                   placeholder="Rate">
        </div>
    </div>
    
    <!-- Capacity -->
    
    <div class="form-group">
        <label for="<?= $prefix ?>-capacity">Capacity</label>
        <div class="input-group">
            <span class="input-group-addon">$</span>
            <input type="number"
                   class="form-control"
                   name="capacity"
                   data-field="capacity"
                   id="<?= $prefix ?>-capacity"
                   placeholder="Capacity">
        </div>
    </div>
            
</form>
