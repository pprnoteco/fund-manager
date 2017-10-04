<?php
/*
 |------------------------------------------------------------------------
 | Model\Entity: Investor
 |------------------------------------------------------------------------
 */
namespace App\Model\Entity;

class Investor extends Entity
{
    protected $_accessible = [ 'id' => false, '*' => true ];
    
    protected $_hidden = [];
}
