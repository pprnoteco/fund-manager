<!-- Template\Investments: Apply transactions
-------------------------------------------------------------------------->

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    Investments
    <small class="text-muted">Apply transactions</small>
</h2>

<hr />

<!-- Main content
-------------------------------------------------------------------------->

<div class="row">
    
    <div class="col-sm-9">
        
        <!-- Breadcrumb
        ----------------------------------------------------------------->
        <ol class="breadcrumb">

            <li class="breadcrumb-item">
                <a href="<?= $this->url('/') ?>">Home</a>
            </li>

            <li class="breadcrumb-item">
                <a href="<?= $this->url('/investments') ?>">Investments</a>
            </li>
            
            <li class="breadcrumb-item active">
                Apply transactions
            </li>
            
            <li class="breadcrumb-item active">
                <?= $date->format('m-d-Y') ?>
            </li>

        </ol>
        
        <!-- Table
        ---------------------------------------------------------------------->
        <table class="table table-bordered table-sm" id="transactions-table">
            <thead>
                <tr>
                    <th data-field="client_id" data-cell-class="align-middle">Client id</th>
                    <th data-field="investor_name" data-cell-class="align-middle">Investor</th>
                    <th data-field="delete" 
                        data-cell-class="align-middle text-center"
                        data-sortable="false">
                        <span class="fa fa-trash"></span>
                    </th>
                    <th data-field="date">Date</th>
                    <th data-field="type">Type</th>
                    <th data-field="amount">Amount</th>
                    <th data-field="add" 
                        data-cell-class="align-middle text-center"
                        data-sortable="false">
                        <span class="fa fa-plus"></span>
                    </th>
                </tr>
            </thead>
            <tbody class="d-none"></tbody>
        </table>
        <?= $this->element('table/pagination', [ 'slug' => 'transactions', 'hidden' => true ]) ?>
        
        <!-- Loading message
        ---------------------------------------------------------------------->
        <div class="alert alert-warning" role="alert" id="loading-message">
            <span class="fa fa-refresh fa-spin"></span>&nbsp;
            Please wait while the server calculates...
        </div>
        
        <!-- Error message
        ---------------------------------------------------------------------->
        <div class="alert alert-danger d-none" role="alert" id="error-message">
            <span class="fa fa-times"></span>&nbsp;
            An unexpected error occured, please try again.
        </div>
        
        <!-- Success message
        ---------------------------------------------------------------------->
        <div class="alert alert-success d-none" role="alert" id="success-message">
            <span class="fa fa-check"></span>&nbsp;
            All transactions for <?= $date->format('M, Y') ?> are up to date
        </div>
        
        <!-- Form
        ---------------------------------------------------------------------->
        <form id="transactions-table-form" class="d-none">
            <button type="button" class="form-control btn btn-primary" data-action="submit">
                <span class="fa fa-check"></span>
                Confirm and submit
            </button>
        </form>
        
    </div>
    
    <!-- Sidebar
    -------------------------------------------------------------------------->
    <div class="col-sm-3 sidebar">
        
        <!-- Searchbox
        ---------------------------------------------------------------------->
        <?= $this->element('table/searchbox', [ 'slug' => 'transactions' ]) ?>
        
        <!-- Navigation
        ---------------------------------------------------------------------->
        <div id="transactions-table-toolbar">
            <div class="list-group">

                <a class="list-group-item" href="<?= $this->url('/investments') ?>">
                    <span class="fa fa-arrow-left fa-fw"></span>
                    Back to index
                </a>

                <button class="list-group-item list-group-item-action" 
                        data-action="create"
                        disabled>
                    <span class="fa fa-plus fa-fw"></span>
                    Add transaction
                </button>

                <button class="list-group-item list-group-item-action" 
                        data-action="export"
                        disabled>
                    <span class="fa fa-download fa-fw"></span>
                    Export to CSV
                </button>

                <button class="list-group-item list-group-item-action" 
                        data-action="import"
                        disabled>
                    <span class="fa fa-upload fa-fw"></span>
                    Import from CSV
                </button>

            </div>

            <div class="list-group" style="margin-top: 20px;">
                
                <button class="list-group-item list-group-item-action" 
                        data-action="undo-delete"
                        disabled>
                    <span class="fa fa-history fa-fw"></span>
                    Undo delete
                </button>
                
                <button class="list-group-item list-group-item-action" 
                        data-action="undo-update"
                        disabled>
                    <span class="fa fa-history fa-fw"></span>
                    Undo update
                </button>
                
            </div>
            
            <hr />
            <label>Change effective date</label>
            <input type="date" 
                   class="form-control" 
                   value="<?= $date->format('Y-m-d') ?>"
                   data-action="effective-date">
            <div class="list-group" style="margin-top: 5px;">
                <button class="list-group-item list-group-item-action" 
                        data-action="recalculate"
                        disabled>
                    <span class="fa fa-refresh fa-fw"></span>
                    Recalculate
                </button>
            </div>
            
        </div>
    </div>
    
</div>

<!-- Modals
-------------------------------------------------------------------------->
<?= $this->element('investments/modal/apply-transactions-add') ?>
<?= $this->element('investments/modal/apply-transactions-import') ?>
<?= $this->element('investments/modal/apply-transactions-submit') ?>

<!-- Javascript
-------------------------------------------------------------------------->
<?php $this->start('script') ?>
<script>
(function(){
    
    var date = new Date('<?= $date->format('Y-m-d') ?>');
    var Investments = App.Investments;
    var View = Investments.views.ApplyTransactions;
    
    var view = new View({
        date: date,
        el: document.getElementById('content')
    });
    
    view.render();
    
}());
</script>
<?php $this->end() ?>