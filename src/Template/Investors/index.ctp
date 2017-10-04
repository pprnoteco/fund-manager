<!-- Template\Investors: Index
-------------------------------------------------------------------------->
<?php
$this->assign('nav-active', 'investors');
?>

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    Investors
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
                Investors
            </li>

        </ol>
        
        <!-- Table
        ----------------------------------------------------------------->
        
        <?= $this->element('investors/table') ?>
        
        <?= $this->element('table/pagination', [ 'slug' => 'investors' ]) ?>
        
    </div>
    
    <!-- Sidebar
    --------------------------------------------------------------------->
    
    <div class="col-sm-3">
        
        <!-- Searchbox
        ----------------------------------------------------------------->
        
        <?= $this->element('table/searchbox', [ 'slug' => 'investors' ]) ?>
        
        <!-- Navigation
        ----------------------------------------------------------------->
        
        <div class="list-group table-toolbar" id="investors-table-toolbar">
            
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
               href="<?= $this->url('/investors/draft-statements') ?>">
                <span class="fa fa-file-pdf-o fa-fw"></span>
                Draft statements
            </a>
            
            <a class="list-group-item list-group-item-action" 
               href="<?= $this->url('/investors/missing-ftp-folders') ?>">
                <span class="fa fa-folder-o fa-fw"></span>
                Missing FTP folders
            </a>
            
        </div>
        
    </div>
    
</div>

<!-- Modals
-------------------------------------------------------------------------->

<?= $this->element('investors/modal/create') ?>
<?= $this->element('investors/modal/update') ?>
<?= $this->element('investors/modal/delete') ?>

<?php $this->start('script') ?> 

<!-- Javascript
-------------------------------------------------------------------------->

<script>
(function(){
    
    var View = App.Investors.views.Index;
    var Collection = App.Investors.Collection;
    var collection = new Collection(
        <?= json_encode($investors, JSON_PRETTY_PRINT) ?>
    );
    
    var view = new View({
        el: document.getElementById('content'),
        collection: collection
    });
    
    view.render();
    
}());
</script>
<?php $this->end() ?>