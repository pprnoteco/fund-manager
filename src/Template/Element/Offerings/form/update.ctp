<!-- Template\Element\Offerings\Form: Update
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'offerings';
?>

<?= $this->element('offerings/form/create', [
    'slug' => $slug,
    'type' => 'update'
]) ?>
