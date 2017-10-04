<?php
/*
 |------------------------------------------------------------------------
 | Model\Table: Table
 |------------------------------------------------------------------------
 */

namespace App\Model\Table;

use ArrayObject;
use Cake\Event\Event;
use Cake\ORM\Table as CakeTable;

class Table extends CakeTable
{
    /*
     |--------------------------------------------------------------------
     | Before marshal
     |--------------------------------------------------------------------
     */
    
    public function beforeMarshal(Event $event, ArrayObject $data, ArrayObject $options)
    {
        if (isset($data['created'])) {
            unset($data['created']);
        }
        if (isset($data['modified'])) {
            unset($data['modified']);
        }
        if (isset($data['created_by_id'])) {
            unset($data['created_by_id']);
        }
        if (isset($data['modified_by_id'])) {
            unset($data['modified_by_id']);
        }
    }
}
