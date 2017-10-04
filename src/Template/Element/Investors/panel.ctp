<!-- Template\Element\Investors: Panel
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'investors';
?>

<div class="container-fluid" style="margin-top: 20px;">
    
    <!-- Investors\Panel: Toolbar
    ---------------------------------------------------------------------->
    
    <div class="btn-group" role="group" id="<?= $slug ?>-table-toolbar">
        
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
    
    <!-- Investors\Panel: Searchbox
    ---------------------------------------------------------------------->
    
    <div class="float-right" style="width: 250px;">
        <?= $this->element('table/searchbox', [ 'slug' => $slug ]) ?>
    </div>
    
    <!-- Investors\Panel: Table
    ---------------------------------------------------------------------->
    
    <?= $this->element('investors/table') ?>
    
    <?= $this->element('table/pagination', [ 'slug' => $slug ]) ?>
    
    <!-- Investors\Panel: Modals
    ---------------------------------------------------------------------->
    
    <?= $this->element('investors/modal/create') ?>
    <?= $this->element('investors/modal/read') ?>
    <?= $this->element('investors/modal/update') ?>
    <?= $this->element('investors/modal/delete') ?>
    
</div>