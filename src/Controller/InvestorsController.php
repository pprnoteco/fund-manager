<?php
/*
 |------------------------------------------------------------------------
 | Controller: Investors controller
 |------------------------------------------------------------------------
 */

namespace App\Controller;

use App\Controller\AppController;
use Cake\Chronos\Date;
use Cake\Event\Event;

class InvestorsController extends AppController
{
    /*
     |--------------------------------------------------------------------
     | Index
     |--------------------------------------------------------------------
     */
    
    public function index()
    {
        $table = $this->Investors;
        $contain = [ 'Accounts' ];
        $entities = $table->find()->contain($contain);
        foreach ($entities as $entity) {
            $accounts = [];
            foreach ($entity->accounts as $account) {
                $accounts[] = $account->name;
            }
            $entity['account.names'] = implode('|', $accounts);
        }
        $this->set('investors', $entities);
        $this->set('_serialize', 'investors');
    }
    
    /*
     |--------------------------------------------------------------------
     | Create
     |--------------------------------------------------------------------
     */
    
    public function create()
    {
        $table = $this->Investors;
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
        $this->set('investor', $entity);
        $this->set('_serialize', 'investor');
    }
    
    /*
     |--------------------------------------------------------------------
     | Read
     |--------------------------------------------------------------------
     */
    
    public function read($id = null)
    {
        $table = $this->Investors;
        $entity = $table->get($id, [
            'contain' => [
                'Accounts',
                'Accounts.Investments',
                'Accounts.Investments.Statements',
                'Accounts.Investments.Offerings',
                'Accounts.Investments.Offerings.Funds',
                'Accounts.Comments',
                'Accounts.Comments.CreatedBy',
                'Accounts.Attachments',
                'Accounts.Attachments.CreatedBy',
                'Accounts.CreatedBy',
                'Accounts.ModifiedBy',
                'Comments',
                'Comments.CreatedBy',
                'Attachments',
                'Attachments.CreatedBy',
                'CreatedBy',
                'ModifiedBy',
            ]
        ]);
        $entity->statements = [];
        $entity->investments = [];
        foreach ($entity->accounts as $account) {
            foreach ($account->investments as $_entity) {
                $_entity['account.name'] = $account->name;
                $_entity['offering.rate'] = $_entity->offering->rate;
                $_entity['offering.fund.name'] = $_entity->offering->fund->name;
                $entity->investments[] = $_entity;
                $entity->statements = array_merge(
                    $entity->statements, $_entity->statements
                );
            }
        }
        $this->set('investor', $entity);
        $this->set('_serialize', 'investor');
    }
    
    /*
     |--------------------------------------------------------------------
     | Update
     |--------------------------------------------------------------------
     */
    
    public function update($id = null)
    {
        $table = $this->Investors;
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
        $this->set('investor', $entity);
        $this->set('_serialize', 'investor');
    }
    
    /*
     |--------------------------------------------------------------------
     | Delete
     |--------------------------------------------------------------------
     */
    
    public function delete($id = null)
    {
        $table = $this->Investors;
        $entity = $table->get($id);
        if ($this->request->is(['delete', 'post'])) {
            if (!$table->delete($entity)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        $this->set('investor', $entity);
        $this->set('_serialize', 'investor');
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
        $query = $this->Investors->find();
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
            'ftp_folder',
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
                $entity->ftp_folder,
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
     |--------------------------------------------------------------------
     | Draft statements
     |--------------------------------------------------------------------
     */
    
    public function draftStatements($date = null)
    {
        
        set_time_limit(0);
        
        $date = new Date(); 
        $date = $date->startOfMonth();
        $asof = $date->subDay(1);
        
        $investments = $this
            ->Investors
            ->Accounts
            ->Investments
            ->find()
            ->contain([
                'Statements'
            ]);
        
        $needed = [];
        
        foreach ($investments as $investment) {
            if (
                $investment->statements_end->lt($date) ||
                $investment->statements_start->gt($date)
            ) {
                continue;
            }
            $exists = false;
            foreach ($investment->statements as $statement) {
                if ($statement->date->eq($date)) $exists = true;
            }
            if (!$exists) {
                $needed[] = [
                    'investment_id' => $investment->id,
                    'date' => $asof->format('m/d/Y')
                ];
            }
        }
        
        die(json_encode([
            'count' => count($needed),
            'investments' => $needed
        ]));
    }
    
    /*
     |--------------------------------------------------------------------
     | Missing ftp folders
     |--------------------------------------------------------------------
     */
    
    public function missingFtpFolders()
    {
        if ($this->request->is('post')) {
            $ids = $this->request->data('id');
            foreach ($ids as $id => $value) {
                if (!$value) continue;
                $investor = $this->Investors->get($id);
                $investor->ftp_folder = $value;
                $this->Investors->save($investor);
            }
        }
        $investors = $this->Investors->find()->where(function ($exp, $q) {
            return $exp->isNull('ftp_folder');
        });
        $this->set('investors', $investors);
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
