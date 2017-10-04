<!-- Template\Element\Users: Panel
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'users';
?>

<div class="container-fluid" style="margin-top: 20px;">
    
    <!-- Users\Panel: Toolbar
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
    
    <!-- Users\Panel: Searchbox
    ---------------------------------------------------------------------->
    
    <div class="float-right" style="width: 250px;">
        <?= $this->element('table/searchbox', [ 'slug' => $slug ]) ?>
    </div>
    
    <!-- Users\Panel: Table
    ---------------------------------------------------------------------->
    
    <?= $this->element('users/table') ?>
    
    <?= $this->element('table/pagination', [ 'slug' => $slug ]) ?>
    
    <!-- Users\Panel: Modals
    ---------------------------------------------------------------------->
    
    <?= $this->element('users/modal/create') ?>
    <?= $this->element('users/modal/read') ?>
    <?= $this->element('users/modal/update') ?>
    <?= $this->element('users/modal/delete') ?>
    
</div>