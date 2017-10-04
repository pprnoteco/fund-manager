<!-- Template\Element\Accounts\Panel: Attachments
-------------------------------------------------------------------------->

<div class="container-fluid" style="margin-top: 20px;">
    
    <!-- Toolbar
    ---------------------------------------------------------------------->
    <div class="btn-group" role="group" id="accounts-attachments-table-toolbar">
        
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
    
    <!-- Searchbox
    ---------------------------------------------------------------------->
    <div class="pull-right" style="width: 250px;">
        <?= $this->element('table/searchbox', [ 'slug' => 'accounts-attachments' ]) ?>
    </div>
    
    <!-- Table
    ---------------------------------------------------------------------->
    <?= $this->element('accounts/table/attachments') ?>
    <?= $this->element('table/pagination', [ 'slug' => 'accounts-attachments' ]) ?>
    
</div>
