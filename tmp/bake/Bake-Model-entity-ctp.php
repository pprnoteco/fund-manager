<CakePHPBakeOpenTagphp
/*
 |------------------------------------------------------------------------
 | Model\Entity: <?= $name . "\n" ?>
 |------------------------------------------------------------------------
 */
namespace <?= $namespace ?>\Model\Entity;

use Cake\ORM\Entity;

class <?= $name ?> extends Entity
{
    protected $_accessible = [ 'id' => false, '*' => true ];
    
    protected $_hidden = [];
}
