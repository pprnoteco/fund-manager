<!-- Template\Admin: Register
------------------------------------------------------------------------------>

<!-- Heading
------------------------------------------------------------------------------>
<h2 class="page-header">
    <span class="fa fa-cog"></span>
    Admin
    <small class="text-muted">Users</small>
</h2>

<hr />

<!-- Main content
------------------------------------------------------------------------------>
<div class="row">
    
    <!-- Right panel
    -------------------------------------------------------------------------->
    <div class="col-sm-9">
        
        <!-- Breadcrumb
        ---------------------------------------------------------------------->
        <ol class="breadcrumb">

            <li class="breadcrumb-item">
                <a href="<?= $this->url('/') ?>">Home</a>
            </li>
            
            <li class="breadcrumb-item">
                <a href="<?= $this->url('/admin') ?>">Admin</a>
            </li>
            
            <li class="breadcrumb-item active">
                Users
            </li>
            
        </ol>
        
        <!-- Table
        ----------------------------------------------------------------->
        <?= $this->element('users/table') ?>
        <?= $this->element('table/pagination', [ 'slug' => 'users' ]) ?>
        
    </div>
    
    <!-- Left panel
    -------------------------------------------------------------------------->
    <div class="col-sm-3">
        
        <!-- Searchbox
        ----------------------------------------------------------------->
        <?= $this->element('table/searchbox', [ 'slug' => 'users' ]) ?>
        
        <!-- Navigation
        ----------------------------------------------------------------->
        <div class="list-group table-toolbar" id="users-table-toolbar">
            
            <a class="list-group-item list-group-item-action" 
               href="<?= $this->url('/admin/users-register') ?>">
                <span class="fa fa-user-plus fa-fw"></span>&nbsp;
                Register new user
            </a>
            
            <button class="list-group-item list-group-item-action" 
                    data-action="reset-password"
                    disabled>
                <span class="fa fa-user-secret fa-fw"></span>&nbsp;
                Reset password
            </button>
            
            <button class="list-group-item list-group-item-action" 
                    data-action="change-role"
                    disabled>
                <span class="fa fa-cog fa-fw"></span>&nbsp;
                Change role
            </button>
            
            <button class="list-group-item list-group-item-action" 
                    data-action="lock"
                    disabled>
                <span class="fa fa-lock fa-fw"></span>&nbsp;
                Lock account
            </button>
            
            <button class="list-group-item list-group-item-action" 
                    data-action="unlock"
                    disabled>
                <span class="fa fa-unlock fa-fw"></span>&nbsp;
                Unlock account
            </button>
            
        </div>
        
        <div class="list-group">
            
            <button class="list-group-item list-group-item-action" 
                    data-action="export">
                <span class="fa fa-download fa-fw"></span>
                Export
            </button>
            
        </div>
        
    </div>
    
</div>

<!-- Modals
------------------------------------------------------------------------------>
<?= $this->element('users/modal/create') ?>
<?= $this->element('users/modal/update') ?>
<?= $this->element('users/modal/delete') ?>

<!-- Javascript
------------------------------------------------------------------------------>
<?php $this->start('script') ?> 
<script>
(function(){
    
    var View = App.Users.views.Index;
    var Collection = App.Users.Collection;
    var collection = new Collection(
        <?= json_encode($users, JSON_PRETTY_PRINT) ?>
    );
    
    var view = new View({
        el: document.getElementById('content'),
        collection: collection
    });
    
    view.render();
    
}());
</script>
<?php $this->end() ?>