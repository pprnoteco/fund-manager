<!-- Template\Element\Statements: Panel
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'statements';
?>

<div class="container-fluid" style="margin-top: 20px;">
    
    <!-- Toolbar
    ---------------------------------------------------------------------->
    <div class="btn-group" role="group" id="<?= $slug ?>-table-toolbar">
        
        <button type="button" 
                class="btn btn-light"
                data-action="sync">
            <span class="fa fa-refresh"></span>
        </button>
        
        <button type="button" 
                class="btn btn-light"
                data-action="download"
                disabled>
            <span class="fa fa-download"></span>
        </button>
        
    </div>
    
    <!-- Searchbox
    ---------------------------------------------------------------------->
    <div class="float-right" style="width: 250px;">
        <?= $this->element('table/searchbox', [ 'slug' => $slug ]) ?>
    </div>
    
    <!-- Table
    ---------------------------------------------------------------------->
    <?= $this->element('statements/table') ?>
    <?= $this->element('table/pagination', [ 'slug' => $slug ]) ?>
    
    <!-- Modals
    ---------------------------------------------------------------------->
    <?= $this->element('statements/modal/sync') ?>
    
</div>