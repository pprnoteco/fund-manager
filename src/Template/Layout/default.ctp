<?php
$this->extend('base');
?>

<!-- Header
------------------------------------------------------------------------------>
<header id="header">
    <?= $this->element('header') ?>
</header>

<!-- Content
------------------------------------------------------------------------------>
<section id="content" class="container-fluid">
    <?= $this->fetch('content') ?>
</section>

<!-- Footer
------------------------------------------------------------------------------>
<footer id="footer">
    <?= $this->element('footer') ?>
</footer>
