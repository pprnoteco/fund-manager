<!-- Template\Element\Attachments: Panel
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'attachments';
?>

<div class="container-fluid" style="margin-top: 20px;">
    
    <!-- Attachments\Panel: Toolbar
    ---------------------------------------------------------------------->
    
    <div class="btn-group" role="group" id="<?= $slug ?>-table-toolbar">
        
        <button type="button" 
                class="btn btn-light"
                data-action="create">
            <span class="fa fa-upload"></span>
        </button>
        
        <button type="button" 
                class="btn btn-light"
                data-action="download"
                disabled>
            <span class="fa fa-download"></span>
        </button>
        
        <button type="button" 
                class="btn btn-light"
                data-action="delete"
                disabled>
            <span class="fa fa-trash"></span>
        </button>
        
    </div>
    
    <!-- Attachments\Panel: Searchbox
    ---------------------------------------------------------------------->
    
    <div class="float-right" style="width: 250px;">
        <?= $this->element('table/searchbox', [ 'slug' => $slug ]) ?>
    </div>
    
    <!-- Attachments\Panel: Table
    ---------------------------------------------------------------------->
    
    <?= $this->element('attachments/table', [ 'slug' => $slug ]) ?>
    
    <?= $this->element('table/pagination', [ 'slug' => $slug ]) ?>
    
    <!-- Attachments\Panel: Modals
    ---------------------------------------------------------------------->
    
    <?= $this->element('attachments/modal/create') ?>
    <?= $this->element('attachments/modal/read') ?>
    <?= $this->element('attachments/modal/update') ?>
    <?= $this->element('attachments/modal/delete') ?>
    
</div>