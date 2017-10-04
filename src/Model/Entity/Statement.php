<?php
/*
 |------------------------------------------------------------------------
 | Model\Entity: Statement
 |------------------------------------------------------------------------
 */
namespace App\Model\Entity;

class Statement extends Entity
{
    protected $_accessible = [ 'id' => false, '*' => true ];
    
    protected $_hidden = [];
}
