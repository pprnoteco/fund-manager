<?php
/*
 |------------------------------------------------------------------------
 | Model\Table: Attachments
 |------------------------------------------------------------------------
 */

namespace App\Model\Table;

class AttachmentsTable extends Table
{
    /*
     |--------------------------------------------------------------------
     | Initialize
     |--------------------------------------------------------------------
     */
    
    public function initialize(array $config)
    {
        // Table
        $this->setPrimaryKey('id');
        $this->setTable('attachments');
        
        // Behaviors
        $this->addBehavior('Timestamp');
        $this->addBehavior('Ownership');
    }
}
