<!-- Template\Element\Accounts\Panel: Comments
-------------------------------------------------------------------------->

<div class="container-fluid" style="margin-top: 20px;">
    
    <!-- Toolbar
    ---------------------------------------------------------------------->
    <div class="btn-group" role="group" id="accounts-comments-table-toolbar">
        
        <button type="button" 
                class="btn btn-light"
                data-action="create">
            <span class="fa fa-plus"></span>
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
    
    <!-- Searchbox
    ---------------------------------------------------------------------->
    <div class="pull-right" style="width: 250px;">
        <?= $this->element('table/searchbox', [ 'slug' => 'accounts-comments' ]) ?>
    </div>
    
    <!-- Table
    ---------------------------------------------------------------------->
    <?= $this->element('accounts/table/comments') ?>
    <?= $this->element('table/pagination', [ 'slug' => 'accounts-comments' ]) ?>
    
</div>
