<?php
/*
 |------------------------------------------------------------------------
 | Controller: <%= $name %> controller
 |------------------------------------------------------------------------
 */
<%
$schema = $modelObj->schema();
$fields = $schema->columns();
$columns = [];
foreach ($fields as $field) {
    $columns[$field] = $schema->column($field);
}
if (!function_exists('dateFormat')) {
    function dateFormat($field, $format) {
        echo 'if (array_key_exists(\'' . $field . '\', $data)) {' . "\n";
        echo '            ';
        echo '$date = $data[\'' . $field . '\'];' . "\n";
        echo '            ';
        echo 'if (!$date) {' . "\n";
        echo '                ';
        echo 'unset($data[\'' . $field . '\']);' . "\n";
        echo '            ';
        echo '} else {' . "\n";
        echo '                ';
        echo '$data[\'' . $field . '\'] = (new DateTime($date))->format(\'' . $format . '\');;' . "\n";
        echo '            ';
        echo "}\n";
        echo '        ';
        echo "}\n";
    }
}
%>

namespace <%= $namespace %>\Controller<%= $prefix %>;

use DateTime;
use App\Controller\AppController;
use Cake\Event\Event;

class <%= $name %>Controller extends AppController
{
    /*
     |--------------------------------------------------------------------
     | Index
     |--------------------------------------------------------------------
     */
    
    public function index()
    {
        $<%= $pluralName %> = $this-><%= $name %>->find()->contain([
            
        ]);
        $this->set('<%= $pluralName %>', $<%= $pluralName %>);
        $this->set('_serialize', '<%= $pluralName %>');
    }
    
    /*
     |--------------------------------------------------------------------
     | Create
     |--------------------------------------------------------------------
     */
    
    public function create()
    {
        $<%= $singularName %> = $this-><%= $name %>->newEntity();
        
        if ($this->request->is('post')) {
            $user = $this->Auth->user();
            $data = $this->request->getData();
            $data = $this->_prepareData($data);
            if ($user) {
                $data['created_by_id'] = $user['id'];
            }
            $<%= $singularName %> = $this-><%= $name %>->patchEntity($<%= $singularName %>, $data);
            if (!$this-><%= $name %>->save($<%= $singularName %>)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        
        $this->set('<%= $singularName %>', $<%= $singularName %>);
        $this->set('_serialize', '<%= $singularName %>');
    }
    
    /*
     |--------------------------------------------------------------------
     | Read
     |--------------------------------------------------------------------
     */
    
    public function read($id = null)
    {
        $<%= $singularName %> = $this-><%= $name %>->get($id, [
            'contain' => [
                'comments',
                'attachments',
            ]
        ]);
        $this->set('<%= $singularName %>', $<%= $singularName %>);
        $this->set('_serialize', '<%= $singularName %>');
    }
    
    /*
     |--------------------------------------------------------------------
     | Update
     |--------------------------------------------------------------------
     */
    
    public function update($id = null)
    {
        $<%= $singularName %> = $this-><%= $name %>->get($id);
        
        if ($this->request->is(['put', 'patch', 'post'])) {
            $user = $this->Auth->user();
            $data = $this->request->getData();
            $data = $this->_prepareData($data);
            if ($user) {
                $data['modified_by_id'] = $user['id'];
            }
            $<%= $singularName %> = $this-><%= $name %>->patchEntity($<%= $singularName %>, $data);
            if (!$this-><%= $name %>->save($<%= $singularName %>)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        
        $this->set('<%= $singularName %>', $<%= $singularName %>);
        $this->set('_serialize', '<%= $singularName %>');
    }
    
    /*
     |--------------------------------------------------------------------
     | Delete
     |--------------------------------------------------------------------
     */
    
    public function delete($id = null)
    {
        $<%= $singularName %> = $this-><%= $name %>->get($id);
        
        if ($this->request->is(['delete', 'post'])) {
            if (!$this-><%= $name %>->delete($<%= $singularName %>)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        
        $this->set('<%= $singularName %>', $<%= $singularName %>);
        $this->set('_serialize', '<%= $singularName %>');
    }
    
    /*
     |--------------------------------------------------------------------
     | Import
     |--------------------------------------------------------------------
     */
    
    public function import()
    {
        
    }
    
    /*
     |--------------------------------------------------------------------
     | Export
     |--------------------------------------------------------------------
     */
    
    public function export()
    {
        
    }
<% if($name == 'Users'): %>
    
    /*
     |--------------------------------------------------------------------
     | Login
     |--------------------------------------------------------------------
     */
    
    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                $this->set('success', true);
                $this->set('redirect', $this->Auth->redirectUrl());
                $this->set('_serialize', ['success', 'redirect']);
                return;
            }
            $this->set('success', false);
            $this->set('error', 'Username or password did not match');
            $this->set('_serialize', ['success', 'error']);
        }
    }
    
    /*
     |--------------------------------------------------------------------
     | Logout
     |--------------------------------------------------------------------
     */
    
    public function logout()
    {
        return $this->redirect($this->Auth->logout());
    }
<% endif %>
    
    /*
     |--------------------------------------------------------------------------
     | Before filter
     |--------------------------------------------------------------------------
     */
    
    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        $this->Auth->deny();
    }
    
    /*
     |--------------------------------------------------------------------------
     | Is authorized
     |--------------------------------------------------------------------------
     */
    
    public function isAuthorized($user = null)
    {
        return true;
    }
    
    /*
     |--------------------------------------------------------------------
     | Prepare data
     |--------------------------------------------------------------------
     */
    
    protected function _prepareData($data)
    {
        unset($data['created']);
        unset($data['modified']);
<% foreach ($columns as $field => $column):
    if ($field == 'created') continue;
    if ($field == 'modified') continue;
    if ($column['type'] == 'date' || $column['type'] == 'datetime' || $column['type'] == 'timestamp'): 
        if ($format = $column['type'] == 'date' ? 'Y-m-d' : 'Y-m-d H:i:s'): %>
        <%= dateFormat($field, $format); %>
<% endif; endif; endforeach; %>
        return $data;
    }
}
