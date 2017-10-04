<!-- Template\Element\<?= ucfirst($pluralVar) ?>\Form: Update
-------------------------------------------------------------------------->

<CakePHPBakeOpenTagphp
$slug = isset($slug) ? $slug : '<?= $slug ?>';
CakePHPBakeCloseTag>

<CakePHPBakeOpenTag= $this->element('<?= $slug ?>/form/create', [
    'slug' => $slug,
    'type' => 'update'
]) CakePHPBakeCloseTag>
