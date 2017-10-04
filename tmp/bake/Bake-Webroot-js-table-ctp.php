/*
 |------------------------------------------------------------------------
 | App\<?= $modelClass ?>: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var <?= $modelClass ?>Table = Table.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
<?php 
foreach($columns as $field => $column):
    $format = null;
    $type = $column['type'];
    if ($type == 'date' || $type == 'datetime' || $type == 'timestamp') {
        $format = 'date';
    }
    if ($type == 'decimal') {
        if ($column['length'] == 15 && $column['precision'] == 2) {
            $format = 'currency';
        }
    }
    if (!$format) continue;
?>
            '<?= $field ?>': Table.formats.<?= $format ?>,
<?php endforeach ?>
        }
        
    });
    
    App.<?= $modelClass ?>.Table = <?= $modelClass ?>Table;
    
}(App));
