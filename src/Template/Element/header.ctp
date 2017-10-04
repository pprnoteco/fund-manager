<!-- Template\Element: Header
------------------------------------------------------------------------->

<?php
$active = $this->fetch('nav-active');
$username = $this->Auth->username();
$fluid = isset($fluid) ? $fluid : true;
$navigation = isset($navigation) ? $navigation : true;
?>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark" id="header-navbar">
    <div class="container<?= $fluid ? '-fluid' : '' ?>">
        
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
            
            <ul class="navbar-nav mr-auto">
                <?php if ($navigation): ?>
                
                <!--
                <li class="nav-item active">
                    <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                </li>
                -->
                
                <li class="nav-item<?= $active == 'funds' ? ' active' : '' ?>">
                    <a class="nav-link" href="<?= $this->url('/funds') ?>">
                        Funds
                        <?= $active == 'funds' ? '<span class="sr-only">(current)</span>' : '' ?>
                    </a>
                </li>
                
                <li class="nav-item<?= $active == 'investors' ? ' active' : '' ?>">
                    <a class="nav-link" href="<?= $this->url('/investors') ?>">
                        Investors
                        <?= $active == 'investors' ? '<span class="sr-only">(current)</span>' : '' ?>
                    </a>
                </li>
                
                <li class="nav-item<?= $active == 'investments' ? ' active' : '' ?>">
                    <a class="nav-link" href="<?= $this->url('/investments') ?>">
                        Investments
                        <?= $active == 'investments' ? '<span class="sr-only">(current)</span>' : '' ?>
                    </a>
                </li>
                
                <?php endif ?>
            </ul>
            
            <!-- Authorization
            ------------------------------------------------------------->
            
            <span class="navbar-text">
                
                <span class="fa fa-user"></span>
                
                <ul class="list-inline navbar-text-nav">
                    <li class="list-inline-item<?= $active == 'profile' ? ' active' : '' ?>">
                        <a href="<?= $this->url('/profile') ?>"><?= $username ?></a>
                    </li>
                    <li class="list-inline-item">
                        <a href="<?= $this->url('/logout') ?>">Logout</a>
                    </li>
                </ul>
                
                <span class="fa fa-cog" style="margin-left: 5px;"></span>
                
                <ul class="list-inline navbar-text-nav">
                    <li class="list-inline-item<?= $active == 'admin' ? ' active' : '' ?>">
                        <a href="<?= $this->url('/admin') ?>">Admin panel</a>
                    </li>
                </ul>
                
            </span>
            
        </div>
        
    </div>
</nav>