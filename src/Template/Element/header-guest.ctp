<!-- Template\Element: Header
------------------------------------------------------------------------->

<?php
$fluid = isset($fluid) ? $fluid : true;
$navigation = isset($navigation) ? $navigation : true;
?>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark" id="header-navbar">
    <div class="container">
        
        <!-- Brand
        ----------------------------------------------------------------->
        
        <a class="navbar-brand" href="<?= $this->url('/') ?>">
            <img src="<?= $this->url('/favicon.png') ?>" height="30" width="30">&nbsp;
            Fund manager
        </a>
        
        <!-- Toggle
        ----------------------------------------------------------------->
        
        <button class="navbar-toggler" 
                type="button" 
                data-toggle="collapse" 
                data-target="#header-navbar-collapse" 
                aria-controls="header-navbar-collapse" 
                aria-expanded="false" 
                aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        
        <!-- Collapse
        ----------------------------------------------------------------->
        
        <div class="collapse navbar-collapse" id="header-navbar-collapse">
            
            <!-- Navigation
            ------------------------------------------------------------->
            <ul class="navbar-nav mr-auto"></ul>
            
            <!-- Authorization
            ------------------------------------------------------------->
            
            <span class="navbar-text">
                
                <span class="fa fa-user"></span>
                
                <ul class="list-inline navbar-text-nav">
                    <li class="list-inline-item<?= $this->fetch('nav-active') == 'login' ? ' active' : '' ?>">
                        <a href="<?= $this->url('/login') ?>">Sign in</a>
                    </li>
                    <li class="list-inline-item<?= $this->fetch('nav-active') == 'register' ? ' active' : '' ?>">
                        <a href="<?= $this->url('/register') ?>">Register</a>
                    </li>
                </ul>
                
            </span>
            
        </div>
        
    </div>
</nav>