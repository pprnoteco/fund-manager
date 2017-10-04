<?php
/*
 |------------------------------------------------------------------------
 | Model\Entity: Offering
 |------------------------------------------------------------------------
 */
namespace App\Model\Entity;

class Offering extends Entity
{
    protected $_accessible = [ 'id' => false, '*' => true ];
    
    protected $_hidden = [];
}
