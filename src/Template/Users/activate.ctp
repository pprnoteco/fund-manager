<?php
$roles = [
    'Read only',
    'User',
    'Admin',
    'Super admin'
];
if (isset($error) && $error) {
    echo "<script>alert('".$error."')</script>";
}
?>
<div class="container">
    
    <h2 class="page-header">Welcome! <small>Activate your account</small></h2>
    <hr />
    
    <form method="post">
        
        <input type="hidden" name="id" value="<?= $user->id ?>" />
        <input type="hidden" name="token" value="<?= $user->token ?>" />
        <input type="hidden" name="username" value="<?= $user->username ?>" />
        <input type="hidden" name="role" value="<?= $user->role ?>" />

        <div class="form-group">
            <label>Role</label>
            <div class="form-control">
                <?= $roles[$user->role] ?>
            </div>
        </div>

        <div class="form-group">
            <label>Username</label>
            <div class="form-control">
                <?= $user->username ?>
            </div>
        </div>

        <div class="form-group">
            <label>Password</label>
            <input type="password" name="password" class="form-control" />
        </div>

        <div class="form-group">
            <label>Confirm password</label>
            <input type="password" name="password2" class="form-control" />
        </div>
        
        <button type="submit" class="btn btn-primary">
            Activate account
        </button>

    </form>
</div>