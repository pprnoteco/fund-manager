<!-- Template\Element\Investors\Panel: Statements
-------------------------------------------------------------------------->

<div class="container-fluid" style="margin-top: 20px;">
    
    <!-- Searchbox
    ---------------------------------------------------------------------->
    <div style="width: 250px;">
        <?= $this->element('table/searchbox', [ 'slug' => 'investors-statements' ]) ?>
    </div>
    
    <!-- Table
    ---------------------------------------------------------------------->
    <?= $this->element('investors/table/statements') ?>
    <?= $this->element('table/pagination', [ 'slug' => 'investors-statements' ]) ?>
    
</div>