<CakePHPBakeOpenTagphp
/*
 |------------------------------------------------------------------------
 | Model\Table: <?= $name . "\n" ?>
 |------------------------------------------------------------------------
 */
namespace <?= $namespace ?>\Model\Table;

use Cake\ORM\Table;

class <?= $name ?>Table extends Table
{
    public function initialize(array $config)
    {
        $this->setPrimaryKey('id');
        $this->setTable('<?= $table ?>');
    }
}
