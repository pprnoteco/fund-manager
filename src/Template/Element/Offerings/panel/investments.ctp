<!-- Offering investments panel
-------------------------------------------------------------------------->
<div class="container-fluid" style="margin-top: 20px;">
    
    <!-- Toolbar
    ---------------------------------------------------------------------->
    <div class="btn-group" role="group" id="offerings-investments-table-toolbar">
        
        <button type="button" 
                class="btn btn-light"
                data-action="read"
                disabled>
            <span class="fa fa-eye"></span>
        </button>
        
        <button type="button" 
                class="btn btn-light"
                data-action="export">
            <span class="fa fa-download"></span>
        </button>
        
    </div>
    
    <!-- Searchbox
    ---------------------------------------------------------------------->
    <div class="float-right" style="width: 250px;">
        <?= $this->element('table/searchbox', [ 'slug' => 'offerings-investments' ]) ?>
    </div>
    
    <!-- Table
    ---------------------------------------------------------------------->
    <?= $this->element('offerings/table/investments') ?>
    <?= $this->element('table/pagination', [ 'slug' => 'offerings-investments' ]) ?>
    
</div>
