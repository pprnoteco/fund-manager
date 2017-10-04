<?php
/*
 |------------------------------------------------------------------------
 | Model\Entity: User
 |------------------------------------------------------------------------
 */

namespace App\Model\Entity;

class User extends Entity
{
    protected $_accessible = [ 'id' => false, '*' => true ];
    
    protected $_hidden = [];
}
