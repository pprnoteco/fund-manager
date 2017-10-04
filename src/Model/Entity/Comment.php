<?php
/*
 |------------------------------------------------------------------------
 | Model\Entity: Comment
 |------------------------------------------------------------------------
 */

namespace App\Model\Entity;

class Comment extends Entity
{
    protected $_accessible = [ 'id' => false, '*' => true ];
    
    protected $_hidden = [];
}
