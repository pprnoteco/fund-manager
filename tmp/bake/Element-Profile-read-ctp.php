<!-- Template\Element\<?= ucfirst($pluralVar) ?>\Profile: Read
-------------------------------------------------------------------------->

<CakePHPBakeOpenTagphp
$slug = isset($slug) ? $slug : '<?= $pluralVar ?>';
CakePHPBakeCloseTag>

<table class="table table-sm profile" id="<CakePHPBakeOpenTag= $slug CakePHPBakeCloseTag>-read-profile">
    <tbody>
        
<?php foreach($fields as $field):
$skip = [ 'id', 'created', 'modified', 'created_by_id', 'modified_by_id' ];
if (in_array($field, $skip)) continue;
$title = ucfirst(str_replace('_', ' ', $field));
?>
        <tr>
            <th colspan="3"><?= $title ?></th>
            <td colspan="9">
                <span data-field="<?= $field ?>"></span>
            </td>
        </tr>
        
<?php endforeach ?>
    </tbody>
</table>
