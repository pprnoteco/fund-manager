<!-- Template\Investments: Read
-------------------------------------------------------------------------->

<?php
$id = $investment->id;
?>

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    Investments
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
                <a href="<?= $this->url('/investments') ?>">Investments</a>
            </li>
            
            <li class="breadcrumb-item active">
                <?= $id ?>
            </li>

        </ol>
        
        <!-- Profile
        ----------------------------------------------------------------->
        
        <?= $this->element('investments/profile/read') ?>
        
    </div>
    
    <!-- Sidebar
    --------------------------------------------------------------------->
    
    <div class="col-sm-3 sidebar">
        
        <!-- Navigation
        ----------------------------------------------------------------->
        
        <div class="list-group" style="margin-bottom: 20px">
            
            <a class="list-group-item" href="<?= $this->url('/investments') ?>">
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
            
            <a class="list-group-item list-group-item-action" 
               href="<?= $this->url('/investments/statement/' . $id) ?>">
                <span class="fa fa-file-pdf-o fa-fw"></span>
                Statement
            </a>
            
        </div>
        
    </div>
    
</div>

<!-- Tabs
------------------------------------------------------------------------->
<ul class="nav nav-tabs" id="investments-tab" role="tablist">
    
    <!-- Transactions tab
    --------------------------------------------------------------------->
    <li class="nav-item">
        <a class="nav-link active" 
           id="investments-transactions-tab" 
           data-toggle="tab" 
           href="#investments-transactions-panel" 
           role="tab" 
           aria-controls="investments-transactions-panel" 
           aria-expanded="true">
            <span class="fa fa-history fa-fw"></span>
            Transactions
        </a>
    </li>
    
    <!-- Statements tab
    --------------------------------------------------------------------->
    <li class="nav-item">
        <a class="nav-link" 
           id="investments-statements-tab" 
           data-toggle="tab" 
           href="#investments-statements-panel" 
           role="tab" 
           aria-controls="investments-statements-panel">
            <span class="fa fa-file-pdf-o fa-fw"></span>
            Statements
        </a>
    </li>
    
    <!-- Comments tab
    --------------------------------------------------------------------->
    <li class="nav-item">
        <a class="nav-link" 
           id="investments-comments-tab" 
           data-toggle="tab" 
           href="#investments-comments-panel" 
           role="tab" 
           aria-controls="investments-comments-panel">
            <span class="fa fa-comment fa-fw"></span>
            Comments
        </a>
    </li>
    
    <!-- Attachments tab
    --------------------------------------------------------------------->
    <li class="nav-item">
        <a class="nav-link" 
           id="investments-attachments-tab" 
           data-toggle="tab" 
           href="#investments-attachments-panel" 
           role="tab" 
           aria-controls="investments-attachments-panel">
            <span class="fa fa-paperclip fa-fw"></span>
            Attachments
        </a>
    </li>
    
</ul>

<div class="tab-content" id="investments-tab-content">
    
    <!-- Transactions Panel
    --------------------------------------------------------------------->
    <div class="tab-pane fade show active" 
         id="investments-transactions-panel" 
         role="tabpanel" 
         aria-labelledby="investments-transactions-tab">
        <?= $this->element('transactions/panel', [ 'parent' => 'investments' ]) ?>
    </div>
    
    <!-- Statements Panel
    --------------------------------------------------------------------->
    <div class="tab-pane fade" 
         id="investments-statements-panel" 
         role="tabpanel" 
         aria-labelledby="investments-statements-tab">
        <?= $this->element('statements/panel', [ 'parent' => 'statements' ]) ?>
    </div>
    
    <!-- Comments Panel
    --------------------------------------------------------------------->
    <div class="tab-pane fade" 
         id="investments-comments-panel" 
         role="tabpanel" 
         aria-labelledby="investments-comments-tab">
        <?= $this->element('comments/panel', [ 'parent' => 'investments' ]) ?>
    </div>
    
    <!-- Attachments Panel
    --------------------------------------------------------------------->
    <div class="tab-pane fade" 
         id="investments-attachments-panel" 
         role="tabpanel" 
         aria-labelledby="investments-attachments-tab">
        <?= $this->element('attachments/panel', [ 'parent' => 'investments' ]) ?>
    </div>
    
</div>

<!-- Modals
-------------------------------------------------------------------------->

<?= $this->element('investments/modal/update') ?>
<?= $this->element('investments/modal/delete') ?>

<?php $this->start('script') ?>

<!-- Javascript
-------------------------------------------------------------------------->

<script>
(function(){
    
    var View = App.Investments.views.Read;
    var Model = App.Investments.Model;
    var model = new Model(
        <?= json_encode($investment, JSON_PRETTY_PRINT) ?>
    );
    var funds = new App.Funds.Collection(
        <?= json_encode($funds, JSON_PRETTY_PRINT) ?>
    );
    var accounts = new App.Accounts.Collection(
        <?= json_encode($accounts, JSON_PRETTY_PRINT) ?>
    );
    var offerings = new App.Offerings.Collection(
        <?= json_encode($offerings, JSON_PRETTY_PRINT) ?>
    );
    var investors = new App.Investors.Collection(
        <?= json_encode($investors, JSON_PRETTY_PRINT) ?>
    );
    
    var view = new View({
        el: document.getElementById('content'),
        model: model,
        funds: funds,
        accounts: accounts,
        offerings: offerings,
        investors: investors,
    });
    
    view.render();
    
}());
</script>
<?php $this->end() ?>