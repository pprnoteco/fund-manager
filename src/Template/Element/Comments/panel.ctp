<!-- Template\Element\Comments: Panel
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'comments';
?>

<div class="container-fluid" style="margin-top: 20px;">
    
    <!-- Comments\Panel: Toolbar
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
    
    <!-- Comments\Panel: Searchbox
    ---------------------------------------------------------------------->
    
    <div class="float-right" style="width: 250px;">
        <?= $this->element('table/searchbox', [ 'slug' => $slug ]) ?>
    </div>
    
    <!-- Comments\Panel: Table
    ---------------------------------------------------------------------->
    
    <?= $this->element('comments/table', [ 'slug' => $slug ]) ?>
    
    <?= $this->element('table/pagination', [ 'slug' => $slug ]) ?>
    
    <!-- Comments\Panel: Modals
    ---------------------------------------------------------------------->
    
    <?= $this->element('comments/modal/create') ?>
    <?= $this->element('comments/modal/read') ?>
    <?= $this->element('comments/modal/update') ?>
    <?= $this->element('comments/modal/delete') ?>
    
</div>