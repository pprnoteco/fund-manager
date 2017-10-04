<!-- Template\Element\<?= ucfirst($pluralVar) ?>\Form: Create
-------------------------------------------------------------------------->

<CakePHPBakeOpenTagphp
$slug = isset($slug) ? $slug : '<?= $slug ?>';
$type = isset($type) ? $type : 'create';
$prefix = $slug . '-' . $type;
CakePHPBakeCloseTag>

<form id="<CakePHPBakeOpenTag= $prefix CakePHPBakeCloseTag>-form">
    
<?php foreach($fields as $field):
$skip = ['id', 'created', 'modified', 'created_by_id', 'modified_by_id'];
if (in_array($field, $skip)) continue;
$title = ucfirst(str_replace('_', ' ', $field));
?>
    <div class="form-group">
        <label for="<CakePHPBakeOpenTag= $prefix CakePHPBakeCloseTag>-<?= $field ?>"><?= $title ?></label>
        <input type="text"
               class="form-control"
               id="<CakePHPBakeOpenTag= $prefix CakePHPBakeCloseTag>-<?= $field ?>"
               name="<?= $field ?>"
               placeholder="<?= $title ?>">
    </div>
            
<?php endforeach ?>
</form>
