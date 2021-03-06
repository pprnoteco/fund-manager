<!-- Template\Element\Funds\Form: Create
-------------------------------------------------------------------------->

<?php
use Cake\Core\Configure;

$slug = isset($slug) ? $slug : 'funds';
$type = isset($type) ? $type : 'create';
$prefix = $slug . '-' . $type;
$states = Configure::read('states');
?>

<form id="<?= $prefix ?>-form">
    
    <!-- Name -->
    
    <div class="form-group">
        <label for="<?= $prefix ?>-name">Name</label>
        <input type="text"
               class="form-control"
               name="name"
               data-field="name"
               id="<?= $prefix ?>-name"
               placeholder="Name">
    </div>
    
    <!-- Address -->
    
    <div class="form-group">
        <label for="<?= $prefix ?>-address">Address</label>
        <input type="text"
               class="form-control"
               name="address"
               data-field="address"
               id="<?= $prefix ?>-address"
               placeholder="Address">
    </div>
    
    <!-- City, State, Zip -->
    
    <div class="row">
        <div class="col-sm-6">
            
            <!-- City -->
            
            <div class="form-group">
                <label for="<?= $prefix ?>-city">City</label>
                <input type="text"
                       class="form-control"
                       name="city"
                       data-field="city"
                       id="<?= $prefix ?>-city"
                       placeholder="City">
            </div>
            
        </div>
        <div class="col-sm-3">
            
            <!-- State -->
            
            <div class="form-group">
                <label for="<?= $prefix ?>-state">State</label>
                <select class="form-control" 
                        name="state"
                        data-field="state"
                        id="<?= $prefix ?>-state">
                    <option value="">Select</option>
                    <?php foreach($states as $value => $title): ?>
                        <option value="<?= $value ?>"><?= $title ?></option>
                    <?php endforeach ?>
                </select>
            </div>
            
        </div>
        <div class="col-sm-3">
            
            <!-- Zip -->
            
            <div class="form-group">
                <label for="<?= $prefix ?>-zip">Zip</label>
                <input type="text"
                       class="form-control"
                       name="zip"
                       data-field="zip"
                       id="<?= $prefix ?>-zip"
                       placeholder="Zip">
            </div>
            
        </div>
    </div>
            
</form>
