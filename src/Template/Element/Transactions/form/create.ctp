<!-- Template\Element\Transactions\Form: Create
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'transactions';
$type = isset($type) ? $type : 'create';
$prefix = $slug . '-' . $type;
?>

<form id="<?= $prefix ?>-form">
    
    <input type="hidden" name="investment_id">
    
    <!-- Type -->
    
    <div class="form-group">
        <label for="<?= $prefix ?>-type">Type</label>
        <select class="form-control" 
                name="type"
                data-field="type"
                id="<?= $prefix ?>-type">
            <option value="0">Initial deposit</option>
            <option value="1">Prorated preferred payment</option>
            <option value="2">Preferred payment</option>
            <option value="3" selected>Drawdown</option>
        </select>
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
            
</form>
