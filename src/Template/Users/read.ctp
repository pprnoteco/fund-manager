<!-- Template\Users: Read
------------------------------------------------------------------------------>
<?php
$this->assign('nav-active', 'profile');
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
            <div class="card-body" id="users-read-profile">
                
                <h1 class="text-center"><span class="fa fa-user"></span></h1>
                <h2 class="text-center"><?= $user->username ?></h2>
                <p class="text-center">Account active for <span data-field="created">[time]</span></p>
                <hr />
                
                <button class="btn btn-primary btn-block">
                    Reset password
                </button>
                
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
    
    var View = App.Users.views.Read;
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