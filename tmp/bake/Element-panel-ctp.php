<!-- Template\Element\<?= ucfirst($pluralVar) ?>: Panel
-------------------------------------------------------------------------->

<CakePHPBakeOpenTagphp
$slug = isset($slug) ? $slug : '<?= $slug ?>';
CakePHPBakeCloseTag>

<div class="container-fluid" style="margin-top: 20px;">
    
    <!-- <?= ucfirst($pluralVar) ?>\Panel: Toolbar
    ---------------------------------------------------------------------->
    
    <div class="btn-group" role="group" id="<CakePHPBakeOpenTag= $slug CakePHPBakeCloseTag>-table-toolbar">
        
        <button type="button" 
                class="btn btn-light"
                data-action="create">
            <span class="fa fa-plus"></span>
        </button>
        
        <button type="button" 
                class="btn btn-light"
                data-action="read"
                disabled>
            <span class="fa fa-eye"></span>
        </button>
        
        <button type="button" 
                class="btn btn-light"
                data-action="update"
                disabled>
            <span class="fa fa-pencil-square-o"></span>
        </button>
        
        <button type="button" 
                class="btn btn-light"
                data-action="delete"
                disabled>
            <span class="fa fa-trash"></span>
        </button>
        
    </div>
    
    <!-- <?= ucfirst($pluralVar) ?>\Panel: Searchbox
    ---------------------------------------------------------------------->
    
    <div class="float-right" style="width: 250px;">
        <CakePHPBakeOpenTag= $this->element('table/searchbox', [ 'slug' => $slug ]) CakePHPBakeCloseTag>
    </div>
    
    <!-- <?= ucfirst($pluralVar) ?>\Panel: Table
    ---------------------------------------------------------------------->
    
    <CakePHPBakeOpenTag= $this->element('<?= $pluralVar ?>/table') CakePHPBakeCloseTag>
    
    <CakePHPBakeOpenTag= $this->element('table/pagination', [ 'slug' => $slug ]) CakePHPBakeCloseTag>
    
    <!-- <?= ucfirst($pluralVar) ?>\Panel: Modals
    ---------------------------------------------------------------------->
    
    <CakePHPBakeOpenTag= $this->element('<?= $pluralVar ?>/modal/create') CakePHPBakeCloseTag>
    <CakePHPBakeOpenTag= $this->element('<?= $pluralVar ?>/modal/read') CakePHPBakeCloseTag>
    <CakePHPBakeOpenTag= $this->element('<?= $pluralVar ?>/modal/update') CakePHPBakeCloseTag>
    <CakePHPBakeOpenTag= $this->element('<?= $pluralVar ?>/modal/delete') CakePHPBakeCloseTag>
    
</div>