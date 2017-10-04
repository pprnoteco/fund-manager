<!-- Template\Attachments: Read
-------------------------------------------------------------------------->

<?php
$id = $attachment->id;
?>

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    Attachments
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
                <a href="<?= $this->url('/attachments') ?>">Attachments
</a>
            </li>
            
            <li class="breadcrumb-item active">
                <?= $id ?>
            </li>

        </ol>
        
        <!-- Profile
        ----------------------------------------------------------------->
        
        <?= $this->element('attachments/profile/read') ?>
        
    </div>
    
    <!-- Sidebar
    --------------------------------------------------------------------->
    
    <div class="col-sm-3 sidebar">
        
        <!-- Navigation
        ----------------------------------------------------------------->
        
        <div class="list-group" style="margin-bottom: 20px">
            
            <a class="list-group-item" href="<?= $this->url('/attachments') ?>">
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
           id="attachments-comments-tab" 
           data-toggle="tab" 
           href="#attachments-comments-panel" 
           role="tab" 
           aria-controls="attachments-comments-panel" 
           aria-expanded="true">
            <span class="fa fa-comment fa-fw"></span>
            Comments
        </a>
    </li>
    
    <!-- Attachments tab
    --------------------------------------------------------------------->
    
    <li class="nav-item">
        <a class="nav-link" 
           id="attachments-attachments-tab" 
           data-toggle="tab" 
           href="#attachments-attachments-panel" 
           role="tab" 
           aria-controls="attachments-attachments-panel">
            <span class="fa fa-paperclip fa-fw"></span>
            Attachments
        </a>
    </li>
    
</ul>

<div class="tab-content" id="myTabContent">
    
    <!-- Comments Panel
    --------------------------------------------------------------------->
    
    <div class="tab-pane fade show active" 
         id="attachments-comments-panel" 
         role="tabpanel" 
         aria-labelledby="attachments-comments-tab">
        <?= $this->element('comments/panel', [ 'parent' => 'attachments' ]) ?>
    </div>
    
    <!-- Attachments Panel
    --------------------------------------------------------------------->
    
    <div class="tab-pane fade" 
         id="attachments-attachments-panel" 
         role="tabpanel" 
         aria-labelledby="attachments-attachments-tab">
        <?= $this->element('attachments/panel', [ 'parent' => 'attachments' ]) ?>
    </div>
    
</div>

<!-- Modals
-------------------------------------------------------------------------->

<?= $this->element('attachments/modal/update') ?>
<?= $this->element('attachments/modal/delete') ?>

<?php $this->start('script') ?>

<!-- Javascript
-------------------------------------------------------------------------->

<script>
(function(){
    
    var View = App.Attachments.views.Read;
    var Model = App.Attachments.Model;
    var model = new Model(
        <?= json_encode($attachment, JSON_PRETTY_PRINT) ?>
    );
    
    var view = new View({
        el: document.getElementById('content'),
        model: model
    });
    
    view.render();
    
}());
</script>
<?php $this->end() ?>