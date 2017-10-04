<!-- Template\<?= ucfirst($pluralVar) ?>: Index
-------------------------------------------------------------------------->

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    <?= $pluralHumanName . "\n" ?>
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
                <a href="<CakePHPBakeOpenTag= $this->url('/') CakePHPBakeCloseTag>">Home</a>
            </li>

            <li class="breadcrumb-item active">
                <?= $pluralHumanName . "\n" ?>
            </li>

        </ol>
        
        <!-- Table
        ----------------------------------------------------------------->
        
        <CakePHPBakeOpenTag= $this->element('<?= $pluralVar ?>/table') CakePHPBakeCloseTag>
        
        <CakePHPBakeOpenTag= $this->element('table/pagination', [ 'slug' => '<?= $slug ?>' ]) CakePHPBakeCloseTag>
        
    </div>
    
    <!-- Sidebar
    --------------------------------------------------------------------->
    
    <div class="col-sm-3">
        
        <!-- Searchbox
        ----------------------------------------------------------------->
        
        <CakePHPBakeOpenTag= $this->element('table/searchbox', [ 'slug' => '<?= $slug ?>' ]) CakePHPBakeCloseTag>
        
        <!-- Navigation
        ----------------------------------------------------------------->
        
        <div class="list-group table-toolbar" id="<?= $slug ?>-table-toolbar">
            
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
               href="<CakePHPBakeOpenTag= $this->url('/<?= $slug ?>/import') CakePHPBakeCloseTag>">
                <span class="fa fa-upload fa-fw"></span>
                Import
            </a>
            
            <a class="list-group-item list-group-item-action" 
               href="<CakePHPBakeOpenTag= $this->url('/<?= $slug ?>/export') CakePHPBakeCloseTag>">
                <span class="fa fa-download fa-fw"></span>
                Export
            </a>
            
        </div>
        
    </div>
    
</div>

<!-- Modals
-------------------------------------------------------------------------->

<CakePHPBakeOpenTag= $this->element('<?= $pluralVar ?>/modal/create') CakePHPBakeCloseTag>
<CakePHPBakeOpenTag= $this->element('<?= $pluralVar ?>/modal/update') CakePHPBakeCloseTag>
<CakePHPBakeOpenTag= $this->element('<?= $pluralVar ?>/modal/delete') CakePHPBakeCloseTag>

<CakePHPBakeOpenTagphp $this->start('script') CakePHPBakeCloseTag> 

<!-- Javascript
-------------------------------------------------------------------------->

<script>
(function(){
    
    var View = App.<?= ucfirst($pluralVar) ?>.views.Index;
    var Collection = App.<?= ucfirst($pluralVar) ?>.Collection;
    var collection = new Collection(
        <CakePHPBakeOpenTag= json_encode($<?= $pluralVar ?>, JSON_PRETTY_PRINT) CakePHPBakeCloseTag>
    );
    
    var view = new View({
        el: document.getElementById('content'),
        collection: collection
    });
    
    view.render();
    
}());
</script>
<CakePHPBakeOpenTagphp $this->end() CakePHPBakeCloseTag>