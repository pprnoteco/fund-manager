<!-- Template\Statements: Read
-------------------------------------------------------------------------->

<?php
$id = $statement->id;
?>

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    Statements
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
                <a href="<?= $this->url('/statements') ?>">Statements
</a>
            </li>
            
            <li class="breadcrumb-item active">
                <?= $id ?>
            </li>

        </ol>
        
        <!-- Profile
        ----------------------------------------------------------------->
        
        <?= $this->element('statements/profile/read') ?>
        
    </div>
    
    <!-- Sidebar
    --------------------------------------------------------------------->
    
    <div class="col-sm-3 sidebar">
        
        <!-- Navigation
        ----------------------------------------------------------------->
        
        <div class="list-group" style="margin-bottom: 20px">
            
            <a class="list-group-item" href="<?= $this->url('/statements') ?>">
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
           id="statements-comments-tab" 
           data-toggle="tab" 
           href="#statements-comments-panel" 
           role="tab" 
           aria-controls="statements-comments-panel" 
           aria-expanded="true">
            <span class="fa fa-comment fa-fw"></span>
            Comments
        </a>
    </li>
    
    <!-- Attachments tab
    --------------------------------------------------------------------->
    
    <li class="nav-item">
        <a class="nav-link" 
           id="statements-attachments-tab" 
           data-toggle="tab" 
           href="#statements-attachments-panel" 
           role="tab" 
           aria-controls="statements-attachments-panel">
            <span class="fa fa-paperclip fa-fw"></span>
            Attachments
        </a>
    </li>
    
</ul>

<div class="tab-content" id="myTabContent">
    
    <!-- Comments Panel
    --------------------------------------------------------------------->
    
    <div class="tab-pane fade show active" 
         id="statements-comments-panel" 
         role="tabpanel" 
         aria-labelledby="statements-comments-tab">
        <?= $this->element('comments/panel', [ 'parent' => 'statements' ]) ?>
    </div>
    
    <!-- Attachments Panel
    --------------------------------------------------------------------->
    
    <div class="tab-pane fade" 
         id="statements-attachments-panel" 
         role="tabpanel" 
         aria-labelledby="statements-attachments-tab">
        <?= $this->element('attachments/panel', [ 'parent' => 'statements' ]) ?>
    </div>
    
</div>

<!-- Modals
-------------------------------------------------------------------------->

<?= $this->element('statements/modal/update') ?>
<?= $this->element('statements/modal/delete') ?>

<?php $this->start('script') ?>

<!-- Javascript
-------------------------------------------------------------------------->

<script>
(function(){
    
    var View = App.Statements.views.Read;
    var Model = App.Statements.Model;
    var model = new Model(
        <?= json_encode($statement, JSON_PRETTY_PRINT) ?>
    );
    
    var view = new View({
        el: document.getElementById('content'),
        model: model
    });
    
    view.render();
    
}());
</script>
<?php $this->end() ?>