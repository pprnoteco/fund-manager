<?php
/*
 |------------------------------------------------------------------------
 | Controller: Transactions controller
 |------------------------------------------------------------------------
 */

namespace App\Controller;

use DateTime;
use App\Controller\AppController;
use Cake\Event\Event;

class TransactionsController extends AppController
{
    /*
     |--------------------------------------------------------------------
     | Index
     |--------------------------------------------------------------------
     */
    
    public function index()
    {
        $table = $this->Transactions;
        $contain = [];
        $entities = $table->find()->contain($contain);
        $this->set('transactions', $entities);
        $this->set('_serialize', 'transactions');
    }
    
    /*
     |--------------------------------------------------------------------
     | Create
     |--------------------------------------------------------------------
     */
    
    public function create()
    {
        $table = $this->Transactions;
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
        $this->set('transaction', $entity);
        $this->set('_serialize', 'transaction');
    }
    
    /*
     |--------------------------------------------------------------------
     | Read
     |--------------------------------------------------------------------
     */
    
    public function read($id = null)
    {
        $table = $this->Transactions;
        $entity = $table->get($id, [
            'contain' => [
                'Comments',
                'Comments.CreatedBy',
                'Attachments',
                'Attachments.CreatedBy',
            ]
        ]);
        $this->set('transaction', $entity);
        $this->set('_serialize', 'transaction');
    }
    
    /*
     |--------------------------------------------------------------------
     | Update
     |--------------------------------------------------------------------
     */
    
    public function update($id = null)
    {
        $table = $this->Transactions;
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
        $this->set('transaction', $entity);
        $this->set('_serialize', 'transaction');
    }
    
    /*
     |--------------------------------------------------------------------
     | Delete
     |--------------------------------------------------------------------
     */
    
    public function delete($id = null)
    {
        $table = $this->Transactions;
        $entity = $table->get($id);
        if ($this->request->is(['delete', 'post'])) {
            if (!$table->delete($entity)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        $this->set('transaction', $entity);
        $this->set('_serialize', 'transaction');
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
        $query = $this->Transactions->find()->contain([
            'Investments',
            'Investments.Offerings',
            'Investments.Offerings.Funds',
            'Investments.Accounts',
            'Investments.Accounts.Investors'
        ]);
        $where = $this->request->query('where');
        $select = $this->request->query('select');
        if ($where) $query->where($where);
        if ($select) $query->select($select);
        
        // Header row
        $csv = $this->Csv->line([
            'id',
            'date',
            'amount',
            'type',
            'description',
            'investment_id',
            'investment_client_id',
            'investment_date',
            'investment_amount',
            'investment_term',
            'investment_balance',
            'investment_fund_id',
            'investment_offering_id',
            'investment_fund_name',
            'investment_offering_rate',
            'investment_investor_id',
            'investment_account_id',
            'investment_investor_name',
            'investment_account_name',
        ]);
        
        function description ($value) {
            switch ($value) {
                case 0: return 'Initial deposit';
                case 1: return 'Preferred payment (prorated)';
                case 2: return 'Preferred payment';
                case 3: return 'Drawdown';
                default: return 'Unknown';
            }
        }
        
        // Body rows
        foreach ($query as $entity) {
            $csv .= $this->Csv->line([
                $entity->id,
                $entity->date,
                $entity->amount,
                $entity->type,
                description($entity->type),
                $entity->investment->id,
                $entity->investment->client_id,
                $entity->investment->date,
                $entity->investment->amount,
                $entity->investment->term,
                $entity->investment->balance,
                $entity->investment->offering->fund->id,
                $entity->investment->offering->id,
                $entity->investment->offering->fund->name,
                $entity->investment->offering->rate / 100,
                $entity->investment->account->investor->id,
                $entity->investment->account->id,
                $entity->investment->account->investor->name,
                $entity->investment->account->name,
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
    
    /*
     |--------------------------------------------------------------------
     | Prepare data
     |--------------------------------------------------------------------
     */
    
    protected function _prepareData($data)
    {
        unset($data['created']);
        unset($data['modified']);
        if (array_key_exists('date', $data)) {
            $date = $data['date'];
            if (!$date) {
                unset($data['date']);
            } else {
                $data['date'] = (new DateTime($date))->format('Y-m-d');;
            }
        }
        return $data;
    }
}
