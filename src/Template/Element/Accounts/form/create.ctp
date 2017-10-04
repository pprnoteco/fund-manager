<!-- Template\Element\Accounts\Form: Create
-------------------------------------------------------------------------->

<?php
use Cake\Core\Configure;

$slug = isset($slug) ? $slug : 'accounts';
$type = isset($type) ? $type : 'create';
$prefix = $slug . '-' . $type;
$states = Configure::read('states');
?>

<form id="<?= $prefix ?>-form">
    
    <div class="form-group">
        <label for="<?= $prefix ?>-type">Type</label>
        <select class="form-control" 
                name="type"
                data-field="type"
                id="<?= $prefix ?>-type">
            <option value="1">Personal</option>
            <option value="2">Business</option>
            <option value="3">IRA</option>
            <option value="4">401K</option>
            <option value="5">Other</option>
        </select>
    </div>
            
    <div class="form-group">
        <label for="<?= $prefix ?>-name">Name</label>
        <input type="text"
               class="form-control"
               id="<?= $prefix ?>-name"
               name="name"
               data-field="name"
               placeholder="Name">
    </div>
            
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
    
    <div class="form-group">
        <label for="<?= $prefix ?>-city">Bank name</label>
        <input type="text"
               class="form-control"
               name="ach_bank"
               data-field="ach_bank"
               id="<?= $prefix ?>-ach_bank"
               placeholder="Bank name">
    </div>

    <div class="form-group">
        <label for="<?= $prefix ?>-city">Routing number</label>
        <input type="text"
               class="form-control"
               name="ach_routing_number"
               data-field="ach_routing_number"
               id="<?= $prefix ?>-ach_routing_number"
               placeholder="Routing number">
    </div>

    <div class="form-group">
        <label for="<?= $prefix ?>-city">Account number</label>
        <input type="text"
               class="form-control"
               name="ach_account_number"
               data-field="ach_account_number"
               id="<?= $prefix ?>-ach_account_number"
               placeholder="Account number">
    </div>

    <div class="form-group">
        <label for="<?= $prefix ?>-city">Account number</label>
        <select class="form-control"
               name="ach_account_type"
               data-field="ach_account_type"
               id="<?= $prefix ?>-ach_account_type">
            <option value="1">Checking</option>
            <option value="2">Savings</option>
        </select>
    </div>
    
</form>
