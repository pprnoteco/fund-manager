<!-- Template\Element\Accounts\Form: Update
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'accounts';
?>

<?= $this->element('accounts/form/create', [
    'slug' => $slug,
    'type' => 'update'
]) ?>
