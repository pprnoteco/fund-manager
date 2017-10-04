<!-- Template\Element\Users\Form: Login
------------------------------------------------------------------------------>

<form id="users-login-form">
    
    <!-- Email address
    -------------------------------------------------------------------------->
    <div class="form-group">
        <label for="users-login-form-username" class="sr-only">Email address</label>
        <div class="input-group">
            <span class="input-group-addon">
                <span class="fa fa-envelope-o"></span>
            </span>
            <input type="email"
                   class="form-control"
                   name="username"
                   data-field="username"
                   id="users-login-form-username"
                   placeholder="Email address">
        </div>
    </div>
    
    <!-- Password
    -------------------------------------------------------------------------->
    <div class="form-group">
        <label for="users-login-form-password" class="sr-only">Password</label>
        <div class="input-group">
            <span class="input-group-addon">
                <span class="fa fa-key"></span>
            </span>
            <input type="password"
                   class="form-control"
                   name="password"
                   data-field="password"
                   id="users-login-form-password"
                   placeholder="Password">
        </div>
    </div>
    
    <!-- Form alert
    -------------------------------------------------------------------------->
    <div class="alert alert-danger d-none"
         data-component="form-alert" 
         id="users-login-form-alert">
        <span data-element="icon" class="fa fa-exclamation-circle"></span>
        <span data-element="message"></span>
    </div>
    
    <!-- Submit
    -------------------------------------------------------------------------->
    <button type="button" class="btn btn-primary btn-block" data-action="submit">
        <span class="fa fa-lock"></span>
        Sign in
    </button>
    
</form>
