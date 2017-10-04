<!-- Template\Element\Transactions\Form: Update
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'transactions';
?>

<?= $this->element('transactions/form/create', [
    'slug' => $slug,
    'type' => 'update'
]) ?>
