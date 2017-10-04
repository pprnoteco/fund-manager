<?php
/*
 |------------------------------------------------------------------------
 | Model\Entity: Fund
 |------------------------------------------------------------------------
 */

namespace App\Model\Entity;

class Fund extends Entity
{
    protected $_accessible = [ 'id' => false, '*' => true ];
    
    protected $_hidden = [];
}
