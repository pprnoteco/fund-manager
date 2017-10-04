<!-- Template\Element\Attachments\Form: Update
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'attachments';
?>

<?= $this->element('attachments/form/create', [
    'slug' => $slug,
    'type' => 'update'
]) ?>
