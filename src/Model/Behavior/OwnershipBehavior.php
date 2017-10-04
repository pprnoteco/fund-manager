<?php
/*
 |------------------------------------------------------------------------
 | Model\Behavior: Ownership
 |------------------------------------------------------------------------
 */

namespace App\Model\Behavior;

use Cake\Event\Event;
use Cake\Event\EventManager;
use Cake\ORM\Behavior;

class OwnershipBehavior extends Behavior
{
    protected $_userId = null;
    
    /*
     |--------------------------------------------------------------------
     | Initialize
     |--------------------------------------------------------------------
     */
    
    public function initialize(array $config)
    {
        $self = $this;
        $this->_table->belongsTo('CreatedBy', [
            'className' => 'Users'
        ]);
        $this->_table->belongsTo('ModifiedBy', [
            'className' => 'Users'
        ]);
        EventManager::instance()->on('Auth.startup', function ($event, $user) use ($self) {
            $self->_userId = $user['id'];
        });
    }
    
    /*
     |--------------------------------------------------------------------
     | Before save
     |--------------------------------------------------------------------
     */
    
    public function beforeSave(Event $event, $entity, $options)
    {
        if ($entity->isNew()) {
            $entity->set('created_by_id', $this->_userId);
        }
        $entity->set('modified_by_id', $this->_userId);
    }
}

