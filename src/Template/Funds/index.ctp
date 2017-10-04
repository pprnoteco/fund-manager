<!-- Template\Funds: Index
------------------------------------------------------------------------------>
<?php
$this->assign('nav-active', 'funds');
?>

<!-- Heading
------------------------------------------------------------------------------>
<h2 class="page-header">
    Funds
    <small class="text-muted">Index</small>
    <hr />
</h2>

<!-- Main content
------------------------------------------------------------------------------>
<div class="row">
    
    <!-- Left column
    -------------------------------------------------------------------------->
    <div class="col-sm-9">
        
        <!-- Breadcrumb
        ---------------------------------------------------------------------->
        <ol class="breadcrumb">

            <li class="breadcrumb-item">
                <a href="<?= $this->url('/') ?>">Home</a>
            </li>

            <li class="breadcrumb-item active">
                Funds
            </li>

        </ol>
        
        <!-- Table
        ---------------------------------------------------------------------->
        <?= $this->element('funds/table') ?>
        <?= $this->element('table/pagination', [ 'slug' => 'funds' ]) ?>
        
    </div>
    
    <!-- Right column
    -------------------------------------------------------------------------->
    <div class="col-sm-3">
        
        <!-- Searchbox
        ---------------------------------------------------------------------->
        <?= $this->element('table/searchbox', [ 'slug' => 'funds' ]) ?>
        
        <!-- Navigation
        ---------------------------------------------------------------------->
        <div class="list-group table-toolbar" id="funds-table-toolbar">
            
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
        
        <!-- Sub navigation
        ---------------------------------------------------------------------->
        <div class="list-group">
            
            <button class="list-group-item list-group-item-action" 
                    data-action="export">
                <span class="fa fa-download fa-fw"></span>
                Export
            </button>
            
        </div>
        
    </div>
    
</div>

<!-- Modals
-------------------------------------------------------------------------->
<?= $this->element('funds/modal/create') ?>
<?= $this->element('funds/modal/update') ?>
<?= $this->element('funds/modal/delete') ?>

<!-- Javascript
-------------------------------------------------------------------------->
<?php $this->start('script') ?> 
<script>
(function(){
    
    var View = App.Funds.views.Index;
    var Collection = App.Funds.Collection;
    var collection = new Collection(
        <?= json_encode($funds, JSON_PRETTY_PRINT) ?>
    );
    
    var view = new View({
        el: document.getElementById('content'),
        collection: collection
    });
    
    view.render();
    
}());
</script>
<?php $this->end() ?>