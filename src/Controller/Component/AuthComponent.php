<?php
/*
 |------------------------------------------------------------------------------
 | Controller\Component: AuthComponent
 |------------------------------------------------------------------------------
 */

namespace App\Controller\Component;

use Cake\Controller\Component\AuthComponent as CakeAuthComponent;
use Cake\Event\Event;
use Cake\Event\EventManager;

class AuthComponent extends CakeAuthComponent
{
    /*
     |-------------------------------------------------------------------------
     | Startup
     |-------------------------------------------------------------------------
     */
    
    public function startup(Event $event)
    {
        $user = $this->user();
        if ($user) {
            $event->getSubject()->set('authUser', $user);
            $event = new Event('Auth.startup', $this, [
                'user' => $user
            ]);
            EventManager::instance()->dispatch($event);
        }
        return parent::startup($event);
    }
  
}
