<!-- Template\Element\Funds\Form: Update
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'funds';
?>

<?= $this->element('funds/form/create', [
    'slug' => $slug,
    'type' => 'update'
]) ?>
