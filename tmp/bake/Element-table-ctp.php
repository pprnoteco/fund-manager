<!-- Template\Element\<?= ucfirst($pluralVar) ?>: Table
-------------------------------------------------------------------------->

<CakePHPBakeOpenTagphp
$slug = isset($slug) ? $slug : '<?= $slug ?>';
CakePHPBakeCloseTag>

<table class="table table-bordered table-striped table-hover" id="<CakePHPBakeOpenTag= $slug CakePHPBakeCloseTag>-table">
    
    <thead>
        <tr>
<?php foreach($fields as $field):
    $title = ucfirst(str_replace('_', ' ', $field));
    $hidden = [
       'id',
       'created',
       'modified',
       'created_by_id',
       'modified_by_id',
       'address',
       'city',
       'state',
       'zip'
    ];
    $visible = in_array($field, $hidden) ? 'false' : 'true';
?>
            <th data-field="<?= $field ?>" 
                data-visible="<?= $visible ?>"<?= $visible == 'false' ? "\n                class=\"d-none\"" : '' ?>>
                <?= $title . "\n" ?>
            </th>
<?php endforeach ?>
        </tr>    
    </thead>
    
    <tbody></tbody>
    
    <tfoot></tfoot>
    
</table>
