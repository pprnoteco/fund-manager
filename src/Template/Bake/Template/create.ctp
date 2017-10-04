<!-- Template\<%= $modelClass %>: Create
-------------------------------------------------------------------------->

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    <%= $pluralHumanName . "\n" %>
    <small class="text-muted">Create</small>
</h2>

<hr />

<?= $this->element('<%= $modelClass %>/form/create') ?>
