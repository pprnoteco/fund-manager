<!-- Template\Element\Users\Form: Update
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'users';
?>

<?= $this->element('users/form/create', [
    'slug' => $slug,
    'type' => 'update'
]) ?>
