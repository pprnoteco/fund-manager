<!-- Template\Element\Funds\Panel: Investments
-------------------------------------------------------------------------->

<div class="container-fluid" style="margin-top: 20px;">
    
    <!-- Funds\Panel: Toolbar
    ---------------------------------------------------------------------->
    
    <div class="btn-group" role="group" id="funds-investments-table-toolbar">
        
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
    
    <!-- Investments\Panel: Searchbox
    ---------------------------------------------------------------------->
    <div class="float-right" style="width: 250px;">
        <?= $this->element('table/searchbox', [ 'slug' => 'funds-investments' ]) ?>
    </div>
    
    <!-- Investments\Panel: Table
    ---------------------------------------------------------------------->
    
    <?= $this->element('funds/table/investments') ?>
    
    <?= $this->element('table/pagination', [ 'slug' => 'funds-investments' ]) ?>
    
</div>