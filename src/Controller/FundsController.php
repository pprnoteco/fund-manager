<?php
/*
 |------------------------------------------------------------------------
 | Controller: Funds controller
 |------------------------------------------------------------------------
 */

namespace App\Controller;

use Cake\Event\Event;

class FundsController extends AppController
{
    /*
     |--------------------------------------------------------------------
     | Index
     |--------------------------------------------------------------------
     */
    
    public function index()
    {
        $table = $this->Funds;
        $contain = [];
        $entities = $table->find()->contain($contain);
        $this->set('funds', $entities);
        $this->set('_serialize', 'funds');
    }
    
    /*
     |--------------------------------------------------------------------
     | Create
     |--------------------------------------------------------------------
     */
    
    public function create()
    {
        $table = $this->Funds;
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
        $this->set('fund', $entity);
        $this->set('_serialize', 'fund');
    }
    
    /*
     |--------------------------------------------------------------------
     | Read
     |--------------------------------------------------------------------
     */
    
    public function read($id = null)
    {
        $table = $this->Funds;
        $entity = $table->get($id, [
            'contain' => [
                'Offerings',
                'Offerings.Comments',
                'Offerings.Comments.CreatedBy',
                'Offerings.Attachments',
                'Offerings.Investments',
                'Offerings.Investments.Accounts',
                'Offerings.Investments.Accounts.Investors',
                'Offerings.CreatedBy',
                'Offerings.ModifiedBy',
                'Comments',
                'Comments.CreatedBy',
                'Attachments',
                'Attachments.CreatedBy',
                'CreatedBy',
                'ModifiedBy',
            ]
        ]);
        $entity->investments = [];
        foreach ($entity->offerings as $offering) {
            foreach ($offering->investments as $_entity) {
                $_entity['rate'] = $offering->rate;
                $_entity['account.name'] = $_entity->account->name;
                $_entity['account.investor.name'] = $_entity->account->investor->name;
                $entity->investments[] = $_entity;
            }
        }
        $this->set('fund', $entity);
        $this->set('_serialize', 'fund');
    }
    
    /*
     |--------------------------------------------------------------------
     | Update
     |--------------------------------------------------------------------
     */
    
    public function update($id = null)
    {
        $table = $this->Funds;
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
        $this->set('fund', $entity);
        $this->set('_serialize', 'fund');
    }
    
    /*
     |--------------------------------------------------------------------
     | Delete
     |--------------------------------------------------------------------
     */
    
    public function delete($id = null)
    {
        $table = $this->Funds;
        $entity = $table->get($id);
        if ($this->request->is(['delete', 'post'])) {
            if (!$table->delete($entity)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        $this->set('fund', $entity);
        $this->set('_serialize', 'fund');
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
        $query = $this->Funds->find();
        $where = $this->request->query('where');
        
        if ($where) $query->where($where);
        
        // Header row
        $csv = $this->Csv->line([
            'id',
            'name',
            'address',
            'city',
            'state',
            'zip',
            'investments_count',
            'investments_amount',
            'investments_balance',
        ]);
        
        // Body rows
        foreach ($query as $entity) {
            $csv .= $this->Csv->line([
                $entity->id,
                $entity->name,
                $entity->address,
                $entity->city,
                $entity->state,
                $entity->zip,
                $entity->investments_count,
                $entity->investments_amount,
                $entity->investments_balance,
            ]);
        }
        
        // Return CSV
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
