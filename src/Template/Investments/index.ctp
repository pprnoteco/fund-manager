<!-- Template\Investments: Index
-------------------------------------------------------------------------->
<?php
$this->assign('nav-active', 'investments');
?>

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    Investments
    <small class="text-muted">Index</small>
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

            <li class="breadcrumb-item active">
                Investments
            </li>

        </ol>
        
        <!-- Table
        ----------------------------------------------------------------->
        
        <?= $this->element('investments/table') ?>
        
        <?= $this->element('table/pagination', [ 'slug' => 'investments' ]) ?>
        
    </div>
    
    <!-- Sidebar
    --------------------------------------------------------------------->
    
    <div class="col-sm-3">
        
        <!-- Searchbox
        ----------------------------------------------------------------->
        
        <?= $this->element('table/searchbox', [ 'slug' => 'investments' ]) ?>
        
        <!-- Navigation
        ----------------------------------------------------------------->
        
        <div class="list-group table-toolbar" id="investments-table-toolbar">
            
            <button class="list-group-item list-group-item-action" 
                    data-action="create">
                <span class="fa fa-plus fa-fw"></span>
                Create
            </button>
            
            <button class="list-group-item list-group-item-action" 
                    data-action="read"
                    disabled>
                <span class="fa fa-eye fa-fw"></span>
                View
            </button>
            
            <button class="list-group-item list-group-item-action" 
                    data-action="update"
                    disabled>
                <span class="fa fa-pencil-square-o fa-fw"></span>
                Update
            </button>
            
            <button class="list-group-item list-group-item-action" 
                    data-action="delete"
                    disabled>
                <span class="fa fa-trash fa-fw"></span>
                Delete
            </button>
            
        </div>
        
        <div class="list-group">
            
            <button class="list-group-item list-group-item-action" 
                    data-action="export">
                <span class="fa fa-download fa-fw"></span>
                Export
            </button>
            
            <a class="list-group-item list-group-item-action" 
               href="<?= $this->url('/investments/apply-transactions') ?>">
                <span class="fa fa-history fa-fw"></span>
                Apply transactions
            </a>
            
        </div>
        
    </div>
    
</div>

<!-- Modals
-------------------------------------------------------------------------->

<?= $this->element('investments/modal/create') ?>
<?= $this->element('investments/modal/update') ?>
<?= $this->element('investments/modal/delete') ?>

<?php $this->start('script') ?> 

<!-- Javascript
-------------------------------------------------------------------------->

<script>
(function(){
    
    var View = App.Investments.views.Index;
    var Collection = App.Investments.Collection;
    var collection = new Collection(
        <?= json_encode($investments, JSON_PRETTY_PRINT) ?>
    );
    var funds = new App.Funds.Collection(
        <?= json_encode($funds, JSON_PRETTY_PRINT) ?>
    );
    var accounts = new App.Accounts.Collection(
        <?= json_encode($accounts, JSON_PRETTY_PRINT) ?>
    );
    var offerings = new App.Offerings.Collection(
        <?= json_encode($offerings, JSON_PRETTY_PRINT) ?>
    );
    var investors = new App.Investors.Collection(
        <?= json_encode($investors, JSON_PRETTY_PRINT) ?>
    );
    
    var view = new View({
        el: document.getElementById('content'),
        collection: collection,
        funds: funds,
        accounts: accounts,
        offerings: offerings,
        investors: investors,
    });
    
    view.render();
    
}());
</script>
<?php $this->end() ?>