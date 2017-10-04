<?php
/*
 |------------------------------------------------------------------------
 | Model\Entity: Investment
 |------------------------------------------------------------------------
 */
namespace App\Model\Entity;

use Cake\Chronos\Date;
use Cake\ORM\TableRegistry;

class Investment extends Entity
{
    protected $_accessible = [ 'id' => false, '*' => true ];
    
    protected $_hidden = [];
}
