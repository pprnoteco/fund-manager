<?php
/*
 |------------------------------------------------------------------------
 | Model\Entity: Attachment
 |------------------------------------------------------------------------
 */

namespace App\Model\Entity;

class Attachment extends Entity
{
    protected $_accessible = [ 'id' => false, '*' => true ];
    
    protected $_hidden = [];
}
