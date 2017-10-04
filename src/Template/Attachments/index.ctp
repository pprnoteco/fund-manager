<!-- Template\Attachments: Index
-------------------------------------------------------------------------->

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    Attachments
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
                Attachments
            </li>

        </ol>
        
        <!-- Table
        ----------------------------------------------------------------->
        
        <?= $this->element('attachments/table') ?>
        
        <?= $this->element('table/pagination', [ 'slug' => 'attachments' ]) ?>
        
    </div>
    
    <!-- Sidebar
    --------------------------------------------------------------------->
    
    <div class="col-sm-3">
        
        <!-- Searchbox
        ----------------------------------------------------------------->
        
        <?= $this->element('table/searchbox', [ 'slug' => 'attachments' ]) ?>
        
        <!-- Navigation
        ----------------------------------------------------------------->
        
        <div class="list-group table-toolbar" id="attachments-table-toolbar">
            
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
            
            <a class="list-group-item list-group-item-action" 
               href="<?= $this->url('/attachments/import') ?>">
                <span class="fa fa-upload fa-fw"></span>
                Import
            </a>
            
            <a class="list-group-item list-group-item-action" 
               href="<?= $this->url('/attachments/export') ?>">
                <span class="fa fa-download fa-fw"></span>
                Export
            </a>
            
        </div>
        
    </div>
    
</div>

<!-- Modals
-------------------------------------------------------------------------->

<?= $this->element('attachments/modal/create') ?>
<?= $this->element('attachments/modal/update') ?>
<?= $this->element('attachments/modal/delete') ?>

<?php $this->start('script') ?> 

<!-- Javascript
-------------------------------------------------------------------------->

<script>
(function(){
    
    var View = App.Attachments.views.Index;
    var Collection = App.Attachments.Collection;
    var collection = new Collection(
        <?= json_encode($attachments, JSON_PRETTY_PRINT) ?>
    );
    
    var view = new View({
        el: document.getElementById('content'),
        collection: collection
    });
    
    view.render();
    
}());
</script>
<?php $this->end() ?>