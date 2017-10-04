<!-- Template\Admin: Index
------------------------------------------------------------------------------>
<?php
$this->assign('nav-active', 'admin');
?>

<!-- Heading
------------------------------------------------------------------------------>
<h2 class="page-header">
    <span class="fa fa-cog"></span>
    Admin
    <small class="text-muted">Panel</small>
</h2>

<hr />

<h2>User account maintenance</h2>
<hr />

<!-- Navigation
---------------------------------------------------------------------->
<div class="list-group">
    
    <a class="list-group-item list-group-item-action" 
       href="<?= $this->url('/admin/users') ?>">
        <span class="fa fa-address-book-o fa-fw"></span>&nbsp;
        View existing  user accounts
    </a>
    
    <a class="list-group-item list-group-item-action" 
       href="<?= $this->url('/admin/register') ?>">
        <span class="fa fa-user-plus fa-fw"></span>&nbsp;
        Register a new user account
    </a>

    <a class="list-group-item list-group-item-action" 
       href="<?= $this->url('/admin') ?>">
        <span class="fa fa-user-secret fa-fw"></span>&nbsp;
        Reset an existing user's password
    </a>

    <a class="list-group-item list-group-item-action" 
       href="<?= $this->url('/admin') ?>">
        <span class="fa fa-lock fa-fw"></span>&nbsp;
        Change an existing user's role
    </a>

    <a class="list-group-item list-group-item-action" 
       href="<?= $this->url('/admin') ?>">
        <span class="fa fa-trash fa-fw"></span>&nbsp;
        Deactivate an existing account
    </a>

</div>

<hr />

<h2>Data maintenance</h2>

<a href="<?= $this->url('/admin/seed-closed-dates') ?>">Seed closed dates</a>
<br/>
<a href="<?= $this->url('/admin/seed-statement-dates') ?>">Seed statement start dates</a>
<br />
<a href="<?= $this->url('/admin/seed-statements') ?>">Seed statements</a>