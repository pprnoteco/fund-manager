<!-- Template\InvestorsAccounts: Read
-------------------------------------------------------------------------->

<?php
$id = $investorsAccount->id;
?>

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    Investors Accounts
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
                <a href="<?= $this->url('/investors-accounts') ?>">Investors Accounts
</a>
            </li>
            
            <li class="breadcrumb-item active">
                <?= $id ?>
            </li>

        </ol>
        
        <!-- Profile
        ----------------------------------------------------------------->
        
        <?= $this->element('investorsAccounts/profile/read') ?>
        
    </div>
    
    <!-- Sidebar
    --------------------------------------------------------------------->
    
    <div class="col-sm-3 sidebar">
        
        <!-- Navigation
        ----------------------------------------------------------------->
        
        <div class="list-group" style="margin-bottom: 20px">
            
            <a class="list-group-item" href="<?= $this->url('/investors-accounts') ?>">
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

<ul class="nav nav-tabs" id="myTab" role="tablist">
    
    <!-- Comments tab
    --------------------------------------------------------------------->
    
    <li class="nav-item">
        <a class="nav-link active" 
           id="investors-accounts-comments-tab" 
           data-toggle="tab" 
           href="#investors-accounts-comments-panel" 
           role="tab" 
           aria-controls="investors-accounts-comments-panel" 
           aria-expanded="true">
            <span class="fa fa-comment fa-fw"></span>
            Comments
        </a>
    </li>
    
    <!-- Attachments tab
    --------------------------------------------------------------------->
    
    <li class="nav-item">
        <a class="nav-link" 
           id="investors-accounts-attachments-tab" 
           data-toggle="tab" 
           href="#investors-accounts-attachments-panel" 
           role="tab" 
           aria-controls="investors-accounts-attachments-panel">
            <span class="fa fa-paperclip fa-fw"></span>
            Attachments
        </a>
    </li>
    
</ul>

<div class="tab-content" id="myTabContent">
    
    <!-- Comments Panel
    --------------------------------------------------------------------->
    
    <div class="tab-pane fade show active" 
         id="investors-accounts-comments-panel" 
         role="tabpanel" 
         aria-labelledby="investors-accounts-comments-tab">
        <?= $this->element('comments/panel', [ 'parent' => 'investors-accounts' ]) ?>
    </div>
    
    <!-- Attachments Panel
    --------------------------------------------------------------------->
    
    <div class="tab-pane fade" 
         id="investors-accounts-attachments-panel" 
         role="tabpanel" 
         aria-labelledby="investors-accounts-attachments-tab">
        <?= $this->element('attachments/panel', [ 'parent' => 'investors-accounts' ]) ?>
    </div>
    
</div>

<!-- Modals
-------------------------------------------------------------------------->

<?= $this->element('investorsAccounts/modal/update') ?>
<?= $this->element('investorsAccounts/modal/delete') ?>

<?php $this->start('script') ?>

<!-- Javascript
-------------------------------------------------------------------------->

<script>
(function(){
    
    var View = App.InvestorsAccounts.views.Read;
    var Model = App.InvestorsAccounts.Model;
    var model = new Model(
        <?= json_encode($investorsAccount, JSON_PRETTY_PRINT) ?>
    );
    
    var view = new View({
        el: document.getElementById('content'),
        model: model
    });
    
    view.render();
    
}());
</script>
<?php $this->end() ?>