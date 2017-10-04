<!-- Template\Funds: Import
-------------------------------------------------------------------------->

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    Funds
    <small class="text-muted">Import</small>
</h2>

<hr />

<!-- Breadcrumb
------------------------------------------------------------------------->

<ol class="breadcrumb">

    <li class="breadcrumb-item">
        <a href="<?= $this->url('/') ?>">Home</a>
    </li>
    
    <li class="breadcrumb-item">
        <a href="<?= $this->url('/funds') ?>">Funds</a>
    </li>
    
    <li class="breadcrumb-item active">Import</li>

</ol>

<div class="row">
    <div class="col-sm-6">
        
        <p>
            Select a CSV file, matching the import template (to the right), then click "upload". If an id is provided and the record already exists, the existing record will be updated, otherwise a new record will be created.
        </p>
        
        <?= $this->element('Funds/form/import') ?>
        
    </div>
    <div class="col-sm-6">
        
        <?= $this->element('Funds/profile/import') ?>
        
    </div>
</div>
