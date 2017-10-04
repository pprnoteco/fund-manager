<!-- Template\<?= $modelClass ?>: Import
-------------------------------------------------------------------------->

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    <?= $pluralHumanName . "\n" ?>
    <small class="text-muted">Import</small>
</h2>

<hr />

<!-- Breadcrumb
------------------------------------------------------------------------->

<ol class="breadcrumb">

    <li class="breadcrumb-item">
        <a href="<CakePHPBakeOpenTag= $this->url('/') CakePHPBakeCloseTag>">Home</a>
    </li>
    
    <li class="breadcrumb-item">
        <a href="<CakePHPBakeOpenTag= $this->url('/<?= $slug ?>') CakePHPBakeCloseTag>"><?= $pluralHumanName ?></a>
    </li>
    
    <li class="breadcrumb-item active">Import</li>

</ol>

<div class="row">
    <div class="col-sm-6">
        
        <p>
            Select a CSV file, matching the import template (to the right), then click "upload". If an id is provided and the record already exists, the existing record will be updated, otherwise a new record will be created.
        </p>
        
        <CakePHPBakeOpenTag= $this->element('<?= $modelClass ?>/form/import') CakePHPBakeCloseTag>
        
    </div>
    <div class="col-sm-6">
        
        <CakePHPBakeOpenTag= $this->element('<?= $modelClass ?>/profile/import') CakePHPBakeCloseTag>
        
    </div>
</div>
