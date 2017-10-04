<!-- Template\Users: Import
-------------------------------------------------------------------------->

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    Users
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
        <a href="<?= $this->url('/users') ?>">Users</a>
    </li>
    
    <li class="breadcrumb-item active">Import</li>

</ol>

<div class="row">
    <div class="col-sm-6">
        
        <p>
            Select a CSV file, matching the import template (to the right), then click "upload". If an id is provided and the record already exists, the existing record will be updated, otherwise a new record will be created.
        </p>
        
        <?= $this->element('Users/form/import') ?>
        
    </div>
    <div class="col-sm-6">
        
        <?= $this->element('Users/profile/import') ?>
        
    </div>
</div>
