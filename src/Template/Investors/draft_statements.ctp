<!-- Template\Investors: Index
-------------------------------------------------------------------------->

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    Investors
    <small class="text-muted">Draft statements</small>
</h2>

<hr />

<!-- Main content
-------------------------------------------------------------------------->

<div class="row">
    
    <div class="col-sm-9">
        
        <!-- Breadcrumb
        ----------------------------------------------------------------->

        <ol class="breadcrumb">

            <li class="breadcrumb-item">
                <a href="<?= $this->url('/') ?>">Home</a>
            </li>
            
            <li class="breadcrumb-item">
                <a href="<?= $this->url('/investors') ?>">Investors</a>
            </li>

            <li class="breadcrumb-item active">
                Draft statements
            </li>
            
        </ol>
        
        <!-- Form
        ----------------------------------------------------------------->
        
        <p>
            This action may take serveral minutes. Please do not close this window or disconnect from the internet once started.
        </p>
        
        
        
    </div>
    
    <!-- Sidebar
    --------------------------------------------------------------------->
    
    <div class="col-sm-3">
        
        <!-- Navigation
        ----------------------------------------------------------------->
        
        <div class="list-group">
            
            <a class="list-group-item list-group-item-action" 
               href="<?= $this->url('/investors') ?>">
                <span class="fa fa-arrow-left fa-fw"></span>
                Back to index
            </a>
            
            <a class="list-group-item list-group-item-action" 
               href="<?= $this->url('/investors/import') ?>">
                <span class="fa fa-upload fa-fw"></span>
                Import
            </a>
            
            <a class="list-group-item list-group-item-action" 
               href="<?= $this->url('/investors/export') ?>">
                <span class="fa fa-download fa-fw"></span>
                Export
            </a>
            
            <a class="list-group-item list-group-item-action" 
               href="<?= $this->url('/investors/missing-ftp-folders') ?>">
                <span class="fa fa-folder-o fa-fw"></span>
                Missing FTP folders
            </a>
            
        </div>
        
    </div>
    
</div>

<!-- Modals
-------------------------------------------------------------------------->

<?php $this->start('script') ?> 

<!-- Javascript
-------------------------------------------------------------------------->

<script>
(function(){
    
    var C
    
}());
</script>
<?php $this->end() ?>