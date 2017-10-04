<!-- Template\Offerings: Read
-------------------------------------------------------------------------->

<?php
$id = $offering->id;
?>

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    Offerings
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
                <a href="<?= $this->url('/offerings') ?>">Offerings
</a>
            </li>
            
            <li class="breadcrumb-item active">
                <?= $id ?>
            </li>

        </ol>
        
        <!-- Profile
        ----------------------------------------------------------------->
        
        <?= $this->element('offerings/profile/read') ?>
        
    </div>
    
    <!-- Sidebar
    --------------------------------------------------------------------->
    
    <div class="col-sm-3 sidebar">
        
        <!-- Navigation
        ----------------------------------------------------------------->
        
        <div class="list-group" style="margin-bottom: 20px">
            
            <a class="list-group-item" href="<?= $this->url('/offerings') ?>">
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
           id="offerings-comments-tab" 
           data-toggle="tab" 
           href="#offerings-comments-panel" 
           role="tab" 
           aria-controls="offerings-comments-panel" 
           aria-expanded="true">
            <span class="fa fa-comment fa-fw"></span>
            Comments
        </a>
    </li>
    
    <!-- Attachments tab
    --------------------------------------------------------------------->
    
    <li class="nav-item">
        <a class="nav-link" 
           id="offerings-attachments-tab" 
           data-toggle="tab" 
           href="#offerings-attachments-panel" 
           role="tab" 
           aria-controls="offerings-attachments-panel">
            <span class="fa fa-paperclip fa-fw"></span>
            Attachments
        </a>
    </li>
    
</ul>

<div class="tab-content" id="myTabContent">
    
    <!-- Comments Panel
    --------------------------------------------------------------------->
    
    <div class="tab-pane fade show active" 
         id="offerings-comments-panel" 
         role="tabpanel" 
         aria-labelledby="offerings-comments-tab">
        <?= $this->element('comments/panel', [ 'parent' => 'offerings' ]) ?>
    </div>
    
    <!-- Attachments Panel
    --------------------------------------------------------------------->
    
    <div class="tab-pane fade" 
         id="offerings-attachments-panel" 
         role="tabpanel" 
         aria-labelledby="offerings-attachments-tab">
        <?= $this->element('attachments/panel', [ 'parent' => 'offerings' ]) ?>
    </div>
    
</div>

<!-- Modals
-------------------------------------------------------------------------->

<?= $this->element('offerings/modal/update') ?>
<?= $this->element('offerings/modal/delete') ?>

<?php $this->start('script') ?>

<!-- Javascript
-------------------------------------------------------------------------->

<script>
(function(){
    
    var View = App.Offerings.views.Read;
    var Model = App.Offerings.Model;
    var model = new Model(
        <?= json_encode($offering, JSON_PRETTY_PRINT) ?>
    );
    
    var view = new View({
        el: document.getElementById('content'),
        model: model
    });
    
    view.render();
    
}());
</script>
<?php $this->end() ?>