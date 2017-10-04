<?php
/*
 |------------------------------------------------------------------------
 | View\Helper: Auth helper
 |------------------------------------------------------------------------
 */

namespace App\View\Helper;

use Cake\Event\Event;
use Cake\View\Helper;

class AuthHelper extends Helper
{
    protected $_user = null;
    
    /*
     |--------------------------------------------------------------------
     | Before render
     |--------------------------------------------------------------------
     */
    
    public function beforeRender(Event $event, $viewFile)
    {
        if (array_key_exists('authUser', $this->_View->viewVars)) {
            $this->_user = $this->_View->viewVars['authUser'];
        }
    }
    
    /*
     |--------------------------------------------------------------------
     | Username
     |--------------------------------------------------------------------
     */
    
    public function username()
    {
        if (!$this->_user) return null;
        return explode('@', $this->_user['username'])[0];
    }
}
