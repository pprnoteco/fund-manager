<?php
/*
 |------------------------------------------------------------------------
 | Controller: Comments controller
 |------------------------------------------------------------------------
 */

namespace App\Controller;

use Cake\Event\Event;

class CommentsController extends AppController
{
    /*
     |--------------------------------------------------------------------
     | Index
     |--------------------------------------------------------------------
     */
    
    public function index()
    {
        $table = $this->Comments;
        $contain = [];
        $entities = $table->find()->contain($contain);
        $this->set('comments', $entities);
        $this->set('_serialize', 'comments');
    }
    
    /*
     |--------------------------------------------------------------------
     | Create
     |--------------------------------------------------------------------
     */
    
    public function create()
    {
        $table = $this->Comments;
        $entity = $table->newEntity();
        if ($this->request->is('post')) {
            $opts = ['associated' => []];
            $data = $this->request->getData();
            $entity = $table->patchEntity($entity, $data, $opts);
            if (!$table->save($entity)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        $this->set('comment', $entity);
        $this->set('_serialize', 'comment');
    }
    
    /*
     |--------------------------------------------------------------------
     | Read
     |--------------------------------------------------------------------
     */
    
    public function read($id = null)
    {
        $table = $this->Comments;
        $entity = $table->get($id, [
            'contain' => [
                'Comments',
                'Comments.CreatedBy',
                'Attachments',
                'Attachments.CreatedBy',
            ]
        ]);
        $this->set('comment', $entity);
        $this->set('_serialize', 'comment');
    }
    
    /*
     |--------------------------------------------------------------------
     | Update
     |--------------------------------------------------------------------
     */
    
    public function update($id = null)
    {
        $table = $this->Comments;
        $entity = $table->get($id);
        if ($this->request->is(['put', 'patch', 'post'])) {
            $opts = ['associated' => []];
            $data = $this->request->getData();
            $entity = $table->patchEntity($entity, $data, $opts);
            if (!$table->save($entity)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        $this->set('comment', $entity);
        $this->set('_serialize', 'comment');
    }
    
    /*
     |--------------------------------------------------------------------
     | Delete
     |--------------------------------------------------------------------
     */
    
    public function delete($id = null)
    {
        $table = $this->Comments;
        $entity = $table->get($id);
        if ($this->request->is(['delete', 'post'])) {
            if (!$table->delete($entity)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        $this->set('comment', $entity);
        $this->set('_serialize', 'comment');
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
        return $data;
    }
}
