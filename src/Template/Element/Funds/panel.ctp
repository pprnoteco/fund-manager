<!-- Template\Element\Funds: Panel
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'funds';
?>

<div class="container-fluid" style="margin-top: 20px;">
    
    <!-- Funds\Panel: Toolbar
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
    
    <!-- Funds\Panel: Searchbox
    ---------------------------------------------------------------------->
    
    <div class="float-right" style="width: 250px;">
        <?= $this->element('table/searchbox', [ 'slug' => $slug ]) ?>
    </div>
    
    <!-- Funds\Panel: Table
    ---------------------------------------------------------------------->
    
    <?= $this->element('funds/table') ?>
    
    <?= $this->element('table/pagination', [ 'slug' => $slug ]) ?>
    
    <!-- Funds\Panel: Modals
    ---------------------------------------------------------------------->
    
    <?= $this->element('funds/modal/create') ?>
    <?= $this->element('funds/modal/read') ?>
    <?= $this->element('funds/modal/update') ?>
    <?= $this->element('funds/modal/delete') ?>
    
</div>