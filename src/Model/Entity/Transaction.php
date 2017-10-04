<?php
/*
 |------------------------------------------------------------------------
 | Model\Entity: Transaction
 |------------------------------------------------------------------------
 */
namespace App\Model\Entity;

class Transaction extends Entity
{
    protected $_accessible = [ 'id' => false, '*' => true ];
    
    protected $_hidden = [];
}
