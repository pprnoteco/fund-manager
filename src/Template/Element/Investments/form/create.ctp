<!-- Template\Element\Investments\Form: Create
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'investments';
$type = isset($type) ? $type : 'create';
$prefix = $slug . '-' . $type;
?>

<form id="<?= $prefix ?>-form">
    
    <!-- Fund, Offering -->
    
    <div class="row">
        <div class="col-sm-6">
            
            <!-- Fund -->
            
            <div class="form-group">
                <label for="<?= $prefix ?>-fund">Fund</label>
                <select class="form-control" 
                        name="fund"
                        id="<?= $prefix ?>-fund">
                    <option value="">Select one</option>
                </select>
            </div>
            
        </div>
        <div class="col-sm-6">
            
            <!-- Offering -->
            
            <div class="form-group">
                <label for="<?= $prefix ?>-offering_id">Offering</label>
                <select class="form-control" 
                        name="offering_id" 
                        data-field="offering_id"
                        id="<?= $prefix ?>-offering_id" 
                        disabled>
                    <option value="">Select one</option>
                </select>
            </div>
            
        </div>
    </div>
    
    <!-- Investor, Account -->
    
    <div class="row">
        <div class="col-sm-6">
            
            <!-- Investor -->
            
            <div class="form-group">
                <label for="<?= $prefix ?>-investor">Investor</label>
                <select class="form-control" 
                        name="investor"
                        id="<?= $prefix ?>-investor">
                    <option value="">Select one</option>
                </select>
            </div>
            
        </div>
        <div class="col-sm-6">
            
            <!-- Account -->
            
            <div class="form-group">
                <label for="<?= $prefix ?>-offering_id">Account</label>
                <select class="form-control" 
                        name="account_id"
                        data-field="account_id"
                        id="<?= $prefix ?>-account_id" 
                        disabled>
                    <option value="">Select one</option>
                </select>
            </div>
            
        </div>
    </div>
    
    <!-- Date -->
    
    <div class="form-group">
        <label for="<?= $prefix ?>-date">Date</label>
        <div class="input-group">
            <span class="input-group-addon">
                <span class="fa fa-calendar"></span>
            </span>
            <input type="date"
                   class="form-control"
                   name="date"
                   data-field="date"
                   id="<?= $prefix ?>-date"
                   placeholder="Date">
        </div>
    </div>
    
    <!-- Amount -->
    
    <div class="form-group">
        <label for="<?= $prefix ?>-amount">Amount</label>
        <div class="input-group">
            <span class="input-group-addon">$</span>
            <input type="number"
                   class="form-control"
                   name="amount"
                   data-field="amount"
                   id="<?= $prefix ?>-amount"
                   placeholder="Amount">
        </div>
    </div>
    
    <!-- Term -->
    
    <div class="form-group">
        <label for="<?= $prefix ?>-term">Term</label>
        <div class="input-group">
            <input type="number"
                   class="form-control"
                   name="term"
                   data-field="term"
                   id="<?= $prefix ?>-term"
                   placeholder="Term"
                   value="36">
            <span class="input-group-addon">Months</span>
        </div>
    </div>
    
    <!-- Rollover -->
    
    <div class="form-check">
        <label class="form-check-label">
            <input type="checkbox" class="form-check-input">
            This investment reflects a rollover
        </label>
    </div>
    
    <div class="form-check">
        <label class="form-check-label">
            <input type="checkbox" class="form-check-input" id="<?= $prefix ?>-ach">
            ACH
        </label>
    </div>
    
    <div class="d-none" id="<?= $prefix ?>-ach-form">
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
    </div>
    
</form>

