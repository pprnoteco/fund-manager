<!-- Template\Element\Users\Form: Reset password
------------------------------------------------------------------------------>

<form id="users-reset-password-form">
    
    <!-- Email address
    -------------------------------------------------------------------------->
    <div class="form-group">
        <label for="users-reset-password-form-username" class="sr-only">Email address</label>
        <div class="input-group">
            <span class="input-group-addon">
                <span class="fa fa-envelope-o"></span>
            </span>
            <input type="email"
                   class="form-control"
                   name="username"
                   data-field="username"
                   id="users-reset-password-form-username"
                   placeholder="Email address">
        </div>
    </div>
    
    <!-- Form alert
    -------------------------------------------------------------------------->
    <div class="alert alert-danger d-none"
         data-component="form-alert" 
         id="users-reset-password-form-alert">
        <span data-element="icon" class="fa fa-exclamation-circle"></span>
        <span data-element="message"></span>
    </div>
    
    <!-- Submit
    -------------------------------------------------------------------------->
    <button type="button" class="btn btn-primary btn-block" data-action="submit">
        Reset my password
    </button>
    
</form>
