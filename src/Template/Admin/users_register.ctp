<!-- Template\Admin: Register
------------------------------------------------------------------------------>
<?php
if (isset($error) && $error) {
    echo "<script>alert('".$error."')</script>";
}
?>

<!-- Heading
------------------------------------------------------------------------------>
<h2 class="page-header">
    <span class="fa fa-cog"></span>
    Admin
    <small class="text-muted">Register new account</small>
</h2>

<hr />

<!-- Main content
------------------------------------------------------------------------------>
<div class="row">
    
    <!-- Left panel
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
            
            <li class="breadcrumb-item">
                <a href="<?= $this->url('/admin/users') ?>">Users</a>
            </li>
            
            <li class="breadcrumb-item active">
                Register new account
            </li>
            
        </ol>
        
        <!-- Form
        ---------------------------------------------------------------------->
        <p>
            The following form will create a new user and send an activation email.
            The activation email will prompt the user to activate their account
            and select a password.
        </p>
        
        <form method="post">

            <div class="form-group">
                <label>System role</label>
                <select class="form-control" name="role">
                    <option value="0">Read only</option>
                    <option value="1" selected>User</option>
                    <option value="2">Admin</option>
                    <option value="3">Super admin</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Email address</label>
                <input type="email" class="form-control" name="username" data-field="username" placeholder="Email address"/>
                <small class="text-muted">Must be a valid email address</small>
            </div>
            
            <div class="form-group">
                <label>Confirm email address</label>
                <input type="email" class="form-control" name="username2" data-field="username" placeholder="Confirm email address"/>
                <small class="text-muted">Must match the email provided above</small>
            </div>
            
            <button class="btn btn-primary form-control">
                <span class="fa fa-user-plus"></span>&nbsp;
                Register account
            </button>
            
        </form>
        
    </div>
    
    <!-- Right panel
    -------------------------------------------------------------------------->
    <div class="col-sm-3">
        
        <!-- Navigation
        ---------------------------------------------------------------------->
        <div class="list-group">
            
            <a class="list-group-item list-group-item-action" 
               href="<?= $this->url('/admin') ?>">
                <span class="fa fa-arrow-left fa-fw"></span>
                Back to admin panel
            </a>
            
            <a class="list-group-item list-group-item-action" 
               href="<?= $this->url('/admin') ?>">
                <span class="fa fa-user-secret fa-fw"></span>
                Reset an existing user's password
            </a>
            
            <a class="list-group-item list-group-item-action" 
               href="<?= $this->url('/admin') ?>">
                <span class="fa fa-lock fa-fw"></span>
                Change an existing user's role
            </a>
            
            <a class="list-group-item list-group-item-action" 
               href="<?= $this->url('/admin') ?>">
                <span class="fa fa-trash fa-fw"></span>
                Delete an existing user
            </a>
            
        </div>
        
    </div>
    
</div>

<!-- Modals
-------------------------------------------------------------------------->
<?= $this->element('users/modal/create') ?>
<?= $this->element('users/modal/update') ?>
<?= $this->element('users/modal/delete') ?>

<?php $this->start('script') ?> 

<!-- Javascript
-------------------------------------------------------------------------->

<script>
(function(){
    
    var View = App.Users.views.Create;
    var Model = App.Users.Model;
    var user = new Model();
    
    var view = new View({
        el: document.getElementById('content'),
        model: user
    });
    
    view.render();
    
}());
</script>
<?php $this->end() ?>