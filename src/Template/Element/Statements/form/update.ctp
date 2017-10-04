<!-- Template\Element\Statements\Form: Update
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'statements';
?>

<?= $this->element('statements/form/create', [
    'slug' => $slug,
    'type' => 'update'
]) ?>
