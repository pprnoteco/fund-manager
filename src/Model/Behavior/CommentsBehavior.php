<?php
/*
 |------------------------------------------------------------------------
 | Model\Behavior: Comments
 |------------------------------------------------------------------------
 */
namespace App\Model\Behavior;

use Cake\ORM\Behavior;

class CommentsBehavior extends Behavior
{
    /*
     |--------------------------------------------------------------------
     | Initialize
     |--------------------------------------------------------------------
     */
    
    public function initialize (array $config) {
        $this->_table->hasMany('Comments', [
            'conditions' => [
                'Comments.parent' => $this->_table->registryAlias()
            ],
            'foreignKey' => 'parent_id',
            'dependent' => true
        ]);
    }
  
}
