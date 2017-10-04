<?php
/*
 |------------------------------------------------------------------------
 | Model\Entity: Account
 |------------------------------------------------------------------------
 */

namespace App\Model\Entity;

class Account extends Entity
{
    protected $_accessible = [ 'id' => false, '*' => true ];
    
    protected $_hidden = [];
}
