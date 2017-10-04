<!-- Template\Element\<%= ucfirst($pluralVar) %>\Form: Update
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : '<%= $slug %>';
?>

<?= $this->element('<%= $slug %>/form/create', [
    'slug' => $slug,
    'type' => 'update'
]) ?>
