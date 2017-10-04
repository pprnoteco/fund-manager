<!-- Template\Element\<%= ucfirst($pluralVar) %>: Panel
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : '<%= $slug %>';
?>

<div class="container-fluid" style="margin-top: 20px;">
    
    <!-- <%= ucfirst($pluralVar) %>\Panel: Toolbar
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
    
    <!-- <%= ucfirst($pluralVar) %>\Panel: Searchbox
    ---------------------------------------------------------------------->
    
    <div class="float-right" style="width: 250px;">
        <?= $this->element('table/searchbox', [ 'slug' => $slug ]) ?>
    </div>
    
    <!-- <%= ucfirst($pluralVar) %>\Panel: Table
    ---------------------------------------------------------------------->
    
    <?= $this->element('<%= $pluralVar %>/table') ?>
    
    <?= $this->element('table/pagination', [ 'slug' => $slug ]) ?>
    
    <!-- <%= ucfirst($pluralVar) %>\Panel: Modals
    ---------------------------------------------------------------------->
    
    <?= $this->element('<%= $pluralVar %>/modal/create') ?>
    <?= $this->element('<%= $pluralVar %>/modal/read') ?>
    <?= $this->element('<%= $pluralVar %>/modal/update') ?>
    <?= $this->element('<%= $pluralVar %>/modal/delete') ?>
    
</div>