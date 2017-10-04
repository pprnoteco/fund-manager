<?php
/*
 |------------------------------------------------------------------------
 | Model\Table: Comments
 |------------------------------------------------------------------------
 */

namespace App\Model\Table;

class CommentsTable extends Table
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
        $this->setTable('comments');
        
        // Behaviors
        $this->addBehavior('Timestamp');
        $this->addBehavior('Ownership');
    }
}
