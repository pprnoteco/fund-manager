<!-- Template\Users: Registration success
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
                
                <h1 class="text-center"><span class="fa fa-check-circle"></span></h1>
                <h2 class="text-center">Registration success</h2>
                <hr/><p>
                    <strong>Congratulations!</strong>
                    Your account has been successfuly registered, you may now sign in to your account.
                </p><hr />
                <a class="btn btn-primary btn-block" href="<?= $this->url('/login') ?>">
                    <span class="fa fa-sign-in"></span>
                    Sign in
                </a>
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