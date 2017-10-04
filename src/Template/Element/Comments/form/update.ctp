<!-- Template\Element\Comments\Form: Update
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'comments';
?>

<?= $this->element('comments/form/create', [
    'slug' => $slug,
    'type' => 'update'
]) ?>
