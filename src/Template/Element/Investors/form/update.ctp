<!-- Template\Element\Investors\Form: Update
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'investors';
?>

<?= $this->element('investors/form/create', [
    'slug' => $slug,
    'type' => 'update'
]) ?>
