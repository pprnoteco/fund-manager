<!-- Template\Element\Users\Form: Create
------------------------------------------------------------------------------>

<?php
$slug = isset($slug) ? $slug : 'users';
$type = isset($type) ? $type : 'create';
$prefix = $slug . '-' . $type;
?>

<form id="users-create-form">
    
    <!-- Email address
    -------------------------------------------------------------------------->
    <div class="form-group">
        <label for="users-create-form-username" class="sr-only">Email address</label>
        <div class="input-group">
            <span class="input-group-addon">
                <span class="fa fa-envelope-o"></span>
            </span>
            <input type="email"
                   class="form-control"
                   name="username"
                   data-field="username"
                   id="users-create-form-username"
                   placeholder="Email address">
        </div>
    </div>
    
    <!-- Password
    -------------------------------------------------------------------------->
    <div class="form-group">
        <label for="users-create-form-password" class="sr-only">Password</label>
        <div class="input-group">
            <span class="input-group-addon">
                <span class="fa fa-key"></span>
            </span>
            <input type="password"
                   class="form-control"
                   name="password"
                   data-field="password"
                   id="users-create-form-password"
                   placeholder="Password">
        </div>
    </div>
    
    <!-- Confirm password
    -------------------------------------------------------------------------->
    <div class="form-group">
        <label for="users-create-form-password2" class="sr-only">Confirm password</label>
        <div class="input-group">
            <span class="input-group-addon">
                <span class="fa fa-key"></span>
            </span>
            <input type="password"
                   class="form-control"
                   name="password2"
                   data-field="password2"
                   id="users-create-form-password2"
                   placeholder="Confirm password">
        </div>
    </div>
    
    <!-- Form alert
    -------------------------------------------------------------------------->
    <div class="alert alert-danger d-none"
         data-component="form-alert" 
         id="users-create-form-alert">
        <span data-element="icon" class="fa fa-exclamation-circle"></span>
        <span data-element="message"></span>
    </div>
    
    <!-- Submit
    -------------------------------------------------------------------------->
    <button type="button" class="btn btn-primary btn-block" data-action="submit">
        <span class="fa fa-user-plus"></span>
        Register
    </button>
    
</form>
