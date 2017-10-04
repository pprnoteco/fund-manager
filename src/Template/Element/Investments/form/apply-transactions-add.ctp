<?php $prefix = 'apply-transactions-add-form' ?>

<!-- Apply transactions add form
------------------------------------------------------------------------------>
<form id="<?= $prefix ?>">
    
    <!-- Investor + account
    -------------------------------------------------------------------------->
    <div class="row">
        <div class="col-sm-6">
            
            <!-- Investor
            ------------------------------------------------------------------>
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
            
            <!-- Account
            ------------------------------------------------------------------>
            <div class="form-group">
                <label for="<?= $prefix ?>-account">Account</label>
                <select class="form-control" 
                        name="account"
                        id="<?= $prefix ?>-account" 
                        disabled>
                    <option value="">Select one</option>
                </select>
            </div>
            
        </div>
    </div>
    
    <!-- Investment
    -------------------------------------------------------------------------->
    <div class="form-group">
        <label for="<?= $prefix ?>-investment_id">Investment</label>
        <select class="form-control" 
                name="investment_id"
                data-field="investment_id"
                id="<?= $prefix ?>-investment_id" 
                disabled>
            <option value="">Select one</option>
        </select>
    </div>
    
    <!-- Type
    -------------------------------------------------------------------------->
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
    
    <!-- Date
    -------------------------------------------------------------------------->
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
    
    <!-- Amount
    -------------------------------------------------------------------------->
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
