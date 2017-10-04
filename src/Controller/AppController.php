<?php
/*
 |------------------------------------------------------------------------
 | Controller: App controller
 |------------------------------------------------------------------------
 */

namespace App\Controller;

use Cake\Controller\Controller;
use Cake\Event\Event;

class AppController extends Controller
{
    /*
     |--------------------------------------------------------------------
     | Initialize
     |--------------------------------------------------------------------
     */
    
    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('RequestHandler');
        $this->loadComponent('Flash');
        $this->loadComponent('Csv');
        $this->loadComponent('Stream');
        $this->loadComponent('Auth', [
            'loginRedirect' => '/',
            'logoutRedirect' => '/login',
            'authorize' => 'Controller',
        ]);
    }
    
    /*
     |--------------------------------------------------------------------
     | Before filter
     |--------------------------------------------------------------------
     */
    
    public function beforeFilter(Event $event)
    {
        $this->loadModel($this->modelClass);
    }
    
    /*
     |--------------------------------------------------------------------
     | Before render
     |--------------------------------------------------------------------
     */
    
    public function beforeRender(Event $event)
    {
        if (!array_key_exists('_serialize', $this->viewVars) &&
            in_array($this->response->type(), ['application/json', 'application/xml'])
        ) {
            $this->set('_serialize', true);
        }
    }
}
