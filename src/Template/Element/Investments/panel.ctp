<!-- Template\Element\Investments: Panel
-------------------------------------------------------------------------->

<?php
$tools = isset($tools) ? $tools : true;
$slug = isset($slug) ? $slug : 'investments';
?>

<div class="container-fluid" style="margin-top: 20px;">
    
    <!-- Investments\Panel: Toolbar
    ---------------------------------------------------------------------->
    <?php if ($tools): ?>
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
    <?php endif ?>
    
    <!-- Investments\Panel: Searchbox
    ---------------------------------------------------------------------->
    <?php if ($tools): ?>
    <div class="float-right" style="width: 250px;">
        <?= $this->element('table/searchbox', [ 'slug' => $slug ]) ?>
    </div>
    <?php endif ?>
    
    <!-- Investments\Panel: Table
    ---------------------------------------------------------------------->
    
    <?= $this->element('investments/table', [ 'slug' => $slug ]) ?>
    
    <?= $this->element('table/pagination', [ 'slug' => $slug ]) ?>
    
    <!-- Investments\Panel: Modals
    ---------------------------------------------------------------------->
    
    <?= $this->element('investments/modal/create') ?>
    <?= $this->element('investments/modal/read') ?>
    <?= $this->element('investments/modal/update') ?>
    <?= $this->element('investments/modal/delete') ?>
    
</div>