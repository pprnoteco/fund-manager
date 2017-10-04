<!-- Template\Users: Login
------------------------------------------------------------------------------>
<?php
$this->layout = 'guest';
$this->assign('nav-active', 'login');
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
                
                <h1 class="text-center"><span class="fa fa-lock"></span></h1>
                <h2 class="text-center">Account login</h2>
                
                <p class="text-center">You can login to an existing account here.</p>
                
                <!-- Login form
                -------------------------------------------------------------->
                <?= $this->element('users/form/login') ?>
                
                <hr />
                
                <ul class="list-inline text-center footer-nav">
                    <li class="list-inline-item">
                        <a href="<?= $this->url('/reset-password') ?>">Forgot password</a>
                    </li>
                    <li class="list-inline-item">
                        <a href="<?= $this->url('/register') ?>">Register</a>
                    </li>
                </ul>
                
            </div>
        
        </div>
        
    </div>
    
    <!-- Right panel
    -------------------------------------------------------------------------->
    <div class="col-sm-4"></div>
    
</div>

<?php $this->start('script') ?>

<!-- Javascript
-------------------------------------------------------------------------->

<script>
(function(){
    
    var View = App.Users.views.Login;
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