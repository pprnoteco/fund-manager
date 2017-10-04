<?php
/*
 |------------------------------------------------------------------------
 | Controller: Accounts controller
 |------------------------------------------------------------------------
 */

namespace App\Controller;

use Cake\Event\Event;

class AccountsController extends AppController
{
    /*
     |--------------------------------------------------------------------
     | Index
     |--------------------------------------------------------------------
     */
    
    public function index()
    {
        $table = $this->Accounts;
        $contain = [];
        $entities = $table->find()->contain($contain);
        $this->set('accounts', $entities);
        $this->set('_serialize', 'accounts');
    }
    
    /*
     |--------------------------------------------------------------------
     | Create
     |--------------------------------------------------------------------
     */
    
    public function create()
    {
        $table = $this->Accounts;
        $entity = $table->newEntity();
        $request = $this->request;
        if ($request->is('post')) {
            $opts = ['associated' => []];
            $data = $request->getData();
            $entity = $table->patchEntity($entity, $data, $opts);
            if (!$table->save($entity)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        } elseif ($request->is('json')) {
            $json = json_encode([
                'success' => false,
                'error' => 'HTTP Method Not Allowed',
                'allowed_methods' => [ 'POST' ]
            ]);
            $stream = $this->Stream->fromString($json, 'application/json');
            $response = $this->response;
            $response = $response->withStatus(405);
            $response = $response->withType('json');
            $response = $response->withBody($stream);
            return $response;
        }
        $this->set('account', $entity);
        $this->set('_serialize', 'account');
    }
    
    /*
     |--------------------------------------------------------------------
     | Read
     |--------------------------------------------------------------------
     */
    
    public function read($id = null)
    {
        $table = $this->Accounts;
        $entity = $table->get($id, [
            'contain' => [
                'Investors',
                'Investments',
                'Comments',
                'Comments.CreatedBy',
                'Attachments',
                'Attachments.CreatedBy',
            ]
        ]);
        $this->set('account', $entity);
        $this->set('_serialize', 'account');
    }
    
    /*
     |--------------------------------------------------------------------
     | Update
     |--------------------------------------------------------------------
     */
    
    public function update($id = null)
    {
        $request = $this->request;
        if (!$id && $request->is('json')) {
            $json = json_encode([
                'success' => false,
                'error' => 'Record [id] not provided in request.',
            ]);
            $stream = $this->Stream->fromString($json, 'application/json');
            $response = $this->response;
            $response = $response->withStatus(400);
            $response = $response->withType('json');
            $response = $response->withBody($stream);
            return $response;
        }
        $table = $this->Accounts;
        $entity = $table->get($id);
        if ($request->is(['put', 'patch', 'post'])) {
            $opts = ['associated' => []];
            $data = $request->getData();
            $entity = $table->patchEntity($entity, $data, $opts);
            if (!$table->save($entity)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        } elseif ($request->is('json')) {
            $json = json_encode([
                'success' => false,
                'error' => 'HTTP Method Not Allowed',
                'allowed_methods' => [ 'PUT', 'PATCH', 'POST' ]
            ]);
            $stream = $this->Stream->fromString($json, 'application/json');
            $response = $this->response;
            $response = $response->withStatus(405);
            $response = $response->withType('json');
            $response = $response->withBody($stream);
            return $response;
        }
        $this->set('account', $entity);
        $this->set('_serialize', 'account');
    }
    
    /*
     |--------------------------------------------------------------------
     | Delete
     |--------------------------------------------------------------------
     */
    
    public function delete($id = null)
    {
        $table = $this->Accounts;
        $entity = $table->get($id);
        if ($this->request->is(['delete', 'post'])) {
            if (!$table->delete($entity)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        $this->set('account', $entity);
        $this->set('_serialize', 'account');
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
        // Query
        $query = $this->Accounts->find()->contain(['Investors']);
        $where = $this->request->query('where');
        
        if ($where) $query->where($where);
        
        // Header row
        $csv = $this->Csv->line([
            'id',
            'type',
            'name',
            'address',
            'city',
            'state',
            'zip',
            'ach_bank_name',
            'ach_routing_number',
            'ach_account_number',
            'ach_account_type',
            'investments_count',
            'investments_amount',
            'investments_balance',
            'investor_id',
            'investor_name',
        ]);
        
        // Body rows
        foreach ($query as $entity) {
            $csv .= $this->Csv->line([
                $entity->id,
                $entity->type,
                $entity->name,
                $entity->address,
                $entity->city,
                $entity->state,
                $entity->zip,
                $entity->ach_bank_name,
                $entity->ach_routing_number,
                $entity->ach_account_number,
                $entity->ach_account_type,
                $entity->investments_count,
                $entity->investments_amount,
                $entity->investments_balance,
                $entity->investor->id,
                $entity->investor->name,
            ]);
        }
        
        $stream = $this->Stream->fromString(rtrim($csv));
        $response = $this->response;
        $response = $response->withType('csv');
        $response = $response->withBody($stream);
        return $response;
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
}
