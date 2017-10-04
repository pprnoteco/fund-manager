<!-- Template\Element\Investments\Form: Update
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'investments';
?>

<?= $this->element('investments/form/create', [
    'slug' => $slug,
    'type' => 'update'
]) ?>
