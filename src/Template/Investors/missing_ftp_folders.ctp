<!-- Template\Investors: Index
-------------------------------------------------------------------------->

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    Investors
    <small class="text-muted">Missing FTP folders</small>
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
                Missing FTP folders
            </li>
            
        </ol>
        
        <!-- Form
        ----------------------------------------------------------------->
        <form method="post">
        
            <table class="table">
                <thead>
                    <tr>
                        <th>Investor</th>
                        <th>FTP Folder</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($investors->count() > 0): ?>
                    <?php foreach ($investors as $investor): ?>
                    <tr>
                        <td class="align-middle"><?= $investor->name ?></td>
                        <td>
                            <input type="text"
                                   class="form-control"
                                   name="id[<?= $investor->id ?>]"
                                   data-id="<?= $investor->id ?>"
                                   placeholder="FTP folder">
                        </td>
                    </tr>
                    <?php endforeach ?>
                    <?php endif ?>
                </tbody>
            </table>
            
            <?php if ($investors->count() == 0): ?>
            <div class="alert alert-success" role="alert">
                <span class="fa fa-check"></span>&nbsp;
                All FTP folders are up to date
            </div>
            <?php else: ?>
            <button type="submit"
                    class="btn btn-primary btn-block" 
                    data-action="submit">
                <span class="fa fa-pencil-square-o"></span>&nbsp;
                Update FTP folders
            </button>
            <?php endif ?>
            
        </form>
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
               href="<?= $this->url('/investors/draft-statements') ?>">
                <span class="fa fa-file-pdf-o fa-fw"></span>
                Draft statements
            </a>
            
        </div>
        
    </div>
    
</div>

<!-- Modals
-------------------------------------------------------------------------->

<?= $this->element('investors/modal/create') ?>
<?= $this->element('investors/modal/update') ?>
<?= $this->element('investors/modal/delete') ?>

<?php $this->start('script') ?> 

<!-- Javascript
-------------------------------------------------------------------------->

<script>
(function(){
    
    var View = App.Investors.views.MissingFtpFolders;
    var Collection = App.Investors.Collection;
    var collection = new Collection(
        <?= json_encode($investors, JSON_PRETTY_PRINT) ?>
    );
    
    var view = new View({
        el: document.getElementById('content'),
        collection: collection
    });
    
    view.render();
    
}());
</script>
<?php $this->end() ?>