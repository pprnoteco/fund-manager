<!-- Template\Element\Offerings\Panel: Attachments
-------------------------------------------------------------------------->

<div class="container-fluid" style="margin-top: 20px;">
    
    <!-- Toolbar
    ---------------------------------------------------------------------->
    <div class="btn-group" role="group" id="offerings-attachments-table-toolbar">
        
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
        <?= $this->element('table/searchbox', [ 'slug' => 'offerings-attachments' ]) ?>
    </div>
    
    <!-- Table
    ---------------------------------------------------------------------->
    <?= $this->element('offerings/table/attachments') ?>
    <?= $this->element('table/pagination', [ 'slug' => 'offerings-attachments' ]) ?>
    
</div>
