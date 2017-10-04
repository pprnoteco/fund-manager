<!-- Template\Element\Accounts: Panel
-------------------------------------------------------------------------->
<?php
$slug = isset($slug) ? $slug : 'accounts';
?>

<div class="container-fluid" style="margin-top: 20px;">
    
    <!-- Accounts\Panel: Toolbar
    ---------------------------------------------------------------------->
    <div class="d-inline" id="<?= $slug ?>-table-toolbar">
        
        <div class="btn-group" role="group">

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
        
        <div class="btn-group" role="group">

            <button type="button" 
                    class="btn btn-light"
                    data-action="export">
                <span class="fa fa-download"></span>
            </button>

        </div>
        
    </div>
    
    <!-- Accounts\Panel: Searchbox
    ---------------------------------------------------------------------->
    <div class="float-right" style="width: 250px;">
        <?= $this->element('table/searchbox', [ 'slug' => $slug ]) ?>
    </div>
    
    <!-- Accounts\Panel: Table
    ---------------------------------------------------------------------->
    <?= $this->element('accounts/table') ?>
    <?= $this->element('table/pagination', [ 'slug' => $slug ]) ?>
    
    <!-- Accounts\Panel: Modals
    ---------------------------------------------------------------------->
    <?= $this->element('accounts/modal/create') ?>
    <?= $this->element('accounts/modal/read') ?>
    <?= $this->element('accounts/modal/update') ?>
    <?= $this->element('accounts/modal/delete') ?>
    
</div>