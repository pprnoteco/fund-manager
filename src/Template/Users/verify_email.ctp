<!-- Template\Users: Verify email
------------------------------------------------------------------------------>
<?php
$this->layout = 'guest';
$error = isset($error) ? $error : false;
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
                
                <h1 class="text-center"><span class="fa fa-envelope"></span></h1>
                <h2 class="text-center">Verify email address</h2>
                
                <hr /><p class="text-center">
                    <strong><span class="fa fa-check-circle"></span> Success!</strong>
                    Your email address has been verified, you may now sign in to your account.
                </p><hr />
                
                <a class="btn btn-primary btn-block" href="<?= $this->url('/login') ?>">
                    <span class="fa fa-sign-in"></span>&nbsp;
                    Sign in
                </a>
                
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
    
    var View = App.Users.views.VerfiyEmail;
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