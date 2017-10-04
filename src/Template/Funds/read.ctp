<!-- Template\Funds: Read
-------------------------------------------------------------------------->

<?php
$id = $fund->id;
?>

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    Funds
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
                <a href="<?= $this->url('/funds') ?>">Funds</a>
            </li>
            
            <li class="breadcrumb-item active">
                <?= $id ?>
            </li>
            
        </ol>
        
        <!-- Profile
        ----------------------------------------------------------------->
        
        <?= $this->element('funds/profile/read') ?>
        
    </div>
    
    <!-- Sidebar
    --------------------------------------------------------------------->
    
    <div class="col-sm-3 sidebar">
        
        <!-- Navigation
        ----------------------------------------------------------------->
        
        <div class="list-group" style="margin-bottom: 20px">
            
            <a class="list-group-item" href="<?= $this->url('/funds') ?>">
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

<ul class="nav nav-tabs" id="funds-tab" role="tablist">
    
    <!-- Offerings tab
    --------------------------------------------------------------------->
    <li class="nav-item">
        <a class="nav-link active" 
           id="funds-offerings-tab" 
           data-toggle="tab" 
           href="#funds-offerings-panel" 
           role="tab" 
           aria-controls="funds-offerings-panel">
            <span class="fa fa-folder fa-fw"></span>
            Offerings
        </a>
    </li>
    
    <!-- Investments tab
    --------------------------------------------------------------------->
    <li class="nav-item">
        <a class="nav-link"
           id="funds-investments-tab" 
           data-toggle="tab" 
           href="#funds-investments-panel" 
           role="tab" 
           aria-controls="funds-investments-panel">
            <span class="fa fa-dollar fa-fw"></span>
            Investments
        </a>
    </li>
    
    <!-- Comments tab
    --------------------------------------------------------------------->
    <li class="nav-item">
        <a class="nav-link"
           id="funds-comments-tab" 
           data-toggle="tab" 
           href="#funds-comments-panel" 
           role="tab" 
           aria-controls="funds-comments-panel">
            <span class="fa fa-comment fa-fw"></span>
            Comments
        </a>
    </li>
    
    <!-- Attachments tab
    --------------------------------------------------------------------->
    <li class="nav-item">
        <a class="nav-link" 
           id="funds-attachments-tab" 
           data-toggle="tab" 
           href="#funds-attachments-panel" 
           role="tab" 
           aria-controls="funds-attachments-panel">
            <span class="fa fa-paperclip fa-fw"></span>
            Attachments
        </a>
    </li>
    
</ul>

<div class="tab-content" id="funds-tab-content">
    
    <!-- Offerings Panel
    --------------------------------------------------------------------->
    <div class="tab-pane fade show active" 
         id="funds-offerings-panel" 
         role="tabpanel" 
         aria-labelledby="funds-offerings-tab">
        <?= $this->element('offerings/panel', [ 'parent' => 'funds' ]) ?>
    </div>
    
    <!-- Investments Panel
    --------------------------------------------------------------------->
    <div class="tab-pane fade" 
         id="funds-investments-panel" 
         role="tabpanel" 
         aria-labelledby="funds-investments-tab">
        <?= $this->element('funds/panel/investments') ?>
    </div>
    
    <!-- Comments Panel
    --------------------------------------------------------------------->
    <div class="tab-pane fade" 
         id="funds-comments-panel" 
         role="tabpanel" 
         aria-labelledby="funds-comments-tab">
        <?= $this->element('comments/panel', [ 'parent' => 'funds' ]) ?>
    </div>
    
    <!-- Attachments Panel
    --------------------------------------------------------------------->
    <div class="tab-pane fade" 
         id="funds-attachments-panel" 
         role="tabpanel" 
         aria-labelledby="funds-attachments-tab">
        <?= $this->element('attachments/panel', [ 'parent' => 'funds' ]) ?>
    </div>
    
</div>

<!-- Modals
-------------------------------------------------------------------------->
<?= $this->element('funds/modal/update') ?>
<?= $this->element('funds/modal/delete') ?>
<?= $this->element('comments/modal/create', [ 'slug' => 'offerings-comments' ]) ?>
<?= $this->element('comments/modal/update', [ 'slug' => 'offerings-comments' ]) ?>
<?= $this->element('comments/modal/delete', [ 'slug' => 'offerings-comments' ]) ?>
<?= $this->element('attachments/modal/create', [ 'slug' => 'offerings-attachments' ]) ?>
<?= $this->element('attachments/modal/update', [ 'slug' => 'offerings-attachments' ]) ?>
<?= $this->element('attachments/modal/delete', [ 'slug' => 'offerings-attachments' ]) ?>

<?php $this->start('script') ?>

<!-- Javascript
-------------------------------------------------------------------------->

<script>
(function(){
    
    var View = App.Funds.views.Read;
    var Model = App.Funds.Model;
    var model = new Model(
        <?= json_encode($fund, JSON_PRETTY_PRINT) ?>
    );
    
    var view = new View({
        el: document.getElementById('content'),
        model: model
    });
    
    view.render();
    
    var ids = [];
    $('[id]').each(function () {
        if (ids.indexOf(this.id) >= 0) {
            console.log(this.id);
        }
        ids.push(this.id);
    });
    
}());
</script>
<?php $this->end() ?>