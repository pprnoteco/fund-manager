<!-- Template\Investors: Read
-------------------------------------------------------------------------->

<?php
$id = $investor->id;
?>

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    Investors
    <small class="text-muted">Profile</small>
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
                <a href="<?= $this->url('/investors') ?>">Investors
</a>
            </li>
            
            <li class="breadcrumb-item active">
                <?= $id ?>
            </li>

        </ol>
        
        <!-- Profile
        ----------------------------------------------------------------->
        
        <?= $this->element('investors/profile/read') ?>
        
    </div>
    
    <!-- Sidebar
    --------------------------------------------------------------------->
    
    <div class="col-sm-3 sidebar">
        
        <!-- Navigation
        ----------------------------------------------------------------->
        
        <div class="list-group" style="margin-bottom: 20px">
            
            <a class="list-group-item" href="<?= $this->url('/investors') ?>">
                <span class="fa fa-arrow-left fa-fw"></span>
                Back to index
            </a>
            
        </div>
        
        <div class="list-group">
            
            <button class="list-group-item list-group-item-action" 
                    data-action="update">
                <span class="fa fa-pencil-square-o fa-fw"></span>
                Update
            </button>
            
            <button class="list-group-item list-group-item-action" 
                    data-action="delete">
                <span class="fa fa-trash fa-fw"></span>
                Delete
            </button>
            
        </div>
        
    </div>
    
</div>

<!-- Tabs
------------------------------------------------------------------------->

<ul class="nav nav-tabs" id="investors-tab" role="tablist">
    
    <!-- Accounts tab
    --------------------------------------------------------------------->
    <li class="nav-item">
        <a class="nav-link active" 
           id="investors-accounts-tab" 
           data-toggle="tab" 
           href="#investors-accounts-panel" 
           role="tab" 
           aria-controls="investors-accounts-panel" 
           aria-expanded="true">
            <span class="fa fa-bank fa-fw"></span>
            Accounts
        </a>
    </li>
    
    <!-- Investments tab
    --------------------------------------------------------------------->
    <li class="nav-item">
        <a class="nav-link" 
           id="investors-investments-tab" 
           data-toggle="tab" 
           href="#investors-investments-panel" 
           role="tab" 
           aria-controls="investors-investments-panel">
            <span class="fa fa-dollar fa-fw"></span>
            Investments
        </a>
    </li>
    
    <!-- Statements tab
    --------------------------------------------------------------------->
    <li class="nav-item">
        <a class="nav-link" 
           id="investors-statements-tab" 
           data-toggle="tab" 
           href="#investors-statements-panel" 
           role="tab" 
           aria-controls="investors-statements-panel">
            <span class="fa fa-file-pdf-o fa-fw"></span>
            Statements
        </a>
    </li>
    
    <!-- Comments tab
    --------------------------------------------------------------------->
    <li class="nav-item">
        <a class="nav-link" 
           id="investors-comments-tab" 
           data-toggle="tab" 
           href="#investors-comments-panel" 
           role="tab" 
           aria-controls="investors-comments-panel">
            <span class="fa fa-comment fa-fw"></span>
            Comments
        </a>
    </li>
    
    <!-- Attachments tab
    --------------------------------------------------------------------->
    <li class="nav-item">
        <a class="nav-link" 
           id="investors-attachments-tab" 
           data-toggle="tab" 
           href="#investors-attachments-panel" 
           role="tab" 
           aria-controls="investors-attachments-panel">
            <span class="fa fa-paperclip fa-fw"></span>
            Attachments
        </a>
    </li>
    
</ul>

<div class="tab-content" id="investors-tab-content">
    
    <!-- Accounts Panel
    --------------------------------------------------------------------->
    <div class="tab-pane fade show active" 
         id="investors-accounts-panel" 
         role="tabpanel" 
         aria-labelledby="investors-accounts-tab">
        <?= $this->element('accounts/panel', [ 'parent' => 'investors' ]) ?>
    </div>
    
    <!-- Investments Panel
    --------------------------------------------------------------------->
    <div class="tab-pane fade" 
         id="investors-investments-panel" 
         role="tabpanel" 
         aria-labelledby="investors-investments-tab">
        <?= $this->element('investors/panel/investments') ?>
    </div>
    
    <!-- Statements Panel
    --------------------------------------------------------------------->
    <div class="tab-pane fade" 
         id="investors-statements-panel" 
         role="tabpanel" 
         aria-labelledby="investors-statements-tab">
        <?= $this->element('investors/panel/statements') ?>
    </div>
    
    <!-- Comments Panel
    --------------------------------------------------------------------->
    <div class="tab-pane fade" 
         id="investors-comments-panel" 
         role="tabpanel" 
         aria-labelledby="investors-comments-tab">
        <?= $this->element('comments/panel', [ 'parent' => 'investors' ]) ?>
    </div>
    
    <!-- Attachments Panel
    --------------------------------------------------------------------->
    <div class="tab-pane fade" 
         id="investors-attachments-panel" 
         role="tabpanel" 
         aria-labelledby="investors-attachments-tab">
        <?= $this->element('attachments/panel', [ 'parent' => 'investors' ]) ?>
    </div>
    
</div>

<!-- Modals
-------------------------------------------------------------------------->

<?= $this->element('investors/modal/update') ?>
<?= $this->element('investors/modal/delete') ?>
<?= $this->element('comments/modal/create', [ 'slug' => 'accounts-comments' ]) ?>
<?= $this->element('comments/modal/update', [ 'slug' => 'accounts-comments' ]) ?>
<?= $this->element('comments/modal/delete', [ 'slug' => 'accounts-comments' ]) ?>
<?= $this->element('attachments/modal/create', [ 'slug' => 'accounts-attachments' ]) ?>
<?= $this->element('attachments/modal/update', [ 'slug' => 'accounts-attachments' ]) ?>
<?= $this->element('attachments/modal/delete', [ 'slug' => 'accounts-attachments' ]) ?>

<?php $this->start('script') ?>

<!-- Javascript
-------------------------------------------------------------------------->

<script>
(function(){
    
    var View = App.Investors.views.Read;
    var Model = App.Investors.Model;
    var model = new Model(
        <?= json_encode($investor, JSON_PRETTY_PRINT) ?>
    );
    
    var view = new View({
        el: document.getElementById('content'),
        model: model
    });
    
    view.render();
    
}());
</script>
<?php $this->end() ?>