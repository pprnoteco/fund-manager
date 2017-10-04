<!-- Template\Users: Reset password
------------------------------------------------------------------------------>
<?php $this->layout = 'guest'; ?>

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
                <h2 class="text-center">Forgot password?</h2>
                
                <p class="text-center">You can reset your password here.</p>
                <hr />
                
                <div id="reset-password-form-container" class="d-none">
                    
                    <!-- Reset password form
                    ---------------------------------------------------------->
                    <?= $this->element('users/form/reset-password') ?>
                    
                </div>
                
                <div id="reset-password-email-container" class="d-none">
                    
                    <p class="text-center">
                        An email with instructions on how to reset your password has been sent to:
                        <strong>jsmith@example.com</strong>.
                        Please allow the server a few minutes to process the email.
                    </p>
                    
                    <!-- Login form
                    ---------------------------------------------------------->
                    <button type="button" class="btn btn-primary btn-block" data-action="resend">
                        Resend password reset email
                    </button>
                    
                </div>
                
                <div id="update-password-form-container" class="d-none2">
                    
                    <!-- Update password form
                    ---------------------------------------------------------->
                    <?= $this->element('users/form/update-password') ?>
                    
                </div>
                
                <hr />
                <ul class="list-inline text-center footer-nav">
                    <li class="list-inline-item">
                        <a href="<?= $this->url('/login') ?>">Sign in</a>
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
    
    var View = App.Users.views.ResetPassword;
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