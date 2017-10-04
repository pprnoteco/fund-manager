<!-- Template\Users: Create
------------------------------------------------------------------------------>
<?php
$this->layout = 'guest';
$this->assign('nav-active', 'register');
?>

<!-- Main content
------------------------------------------------------------------------------>
<div class="row" style="margin-top: 50px">
    
    <!-- Left panel
    -------------------------------------------------------------------------->
    <div class="col-sm-4"></div>
    
    <!-- Middle panel
    -------------------------------------------------------------------------->
    <div class="col-sm-4">
        
        <div class="card">
            
            <!-- Card body
            ------------------------------------------------------------------>
            <div class="card-body">
                
                <h1 class="text-center"><span class="fa fa-user-plus"></span></h1>
                <h2 class="text-center">Account registration</h2>
                
                <p class="text-center">You can create a new account here.</p>
                
                <!-- Login form
                -------------------------------------------------------------->
                <?= $this->element('users/form/create') ?>
                
                <hr />
                
                <ul class="list-inline text-center footer-nav">
                    <li class="list-inline-item">
                        <a href="<?= $this->url('/login') ?>">Sign in</a>
                    </li>
                    <li class="list-inline-item">
                        <a href="<?= $this->url('/reset-password') ?>">Forgot password</a>
                    </li>
                </ul>
                
            </div>
        
        </div>
        
    </div>
    
    <!-- Right panel
    -------------------------------------------------------------------------->
    <div class="col-sm-4"></div>
    
</div>

<!-- Javascript
------------------------------------------------------------------------------>
<?php $this->start('script') ?>
<script>
(function(){
    
    var View = App.Users.views.Create;
    var Model = App.Users.Model;
    var model = new Model();
    
    var view = new View({
        el: document.getElementById('content'),
        model: model
    });
    
    view.render();
    
}());
</script>
<?php $this->end() ?>
