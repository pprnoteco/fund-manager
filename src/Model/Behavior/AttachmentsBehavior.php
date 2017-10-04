<?php
/*
 |------------------------------------------------------------------------------
 | Model\Behavior: Attachments
 |------------------------------------------------------------------------------
 */
namespace App\Model\Behavior;

use Cake\ORM\Behavior;

class AttachmentsBehavior extends Behavior
{
    /*
     |--------------------------------------------------------------------------
     | Initialize
     |--------------------------------------------------------------------------
     */
    
    public function initialize (array $config) {
        $this->_table->hasMany('Attachments', [
            'conditions' => [
                'Attachments.parent' => $this->_table->registryAlias()
            ],
            'foreignKey' => 'parent_id',
            'dependent' => true
        ]);
    }
  
}
