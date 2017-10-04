<!-- Template\Users: Verify email sent
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
                
                <hr />

                <p class="text-center">
                    A verification email has been sent to:
                    <strong><?= $user->username ?></strong>.
                    To complete your registration, please click the link provided in the email.
                    Please allow the server a few minutes to process the email.
                </p>

                <hr />

                <button class="btn btn-primary btn-block" data-action="resend">
                    Resend verification email
                </button>
                
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
    
    var View = App.Users.views.VerifyEmailSent;
    var Model = App.Users.Model;
    var model = new Model(<?= json_encode($user, JSON_PRETTY_PRINT) ?>);
    
    var view = new View({
        el: document.getElementById('content'),
        model: model
    });
    
    view.render();
    
}());
</script>
<?php $this->end() ?>