<?php
/*
 |------------------------------------------------------------------------
 | Controller: Statements controller
 |------------------------------------------------------------------------
 */

namespace App\Controller;

use DateTime;
use App\Controller\AppController;
use Cake\Chronos\MutableDate;
use Cake\Event\Event;

class StatementsController extends AppController
{
    /*
     |--------------------------------------------------------------------
     | Index
     |--------------------------------------------------------------------
     */
    
    public function index()
    {
        $date = new MutableDate('2014-01-01');
        $statements = $this->Statements->find()->where([
            'investment_id' => 1,
            'date <=' => $date
        ]);
        foreach ($statements as $statement) {
            $statement->correct = true;
        }
        $this->Statements->saveMany($statements);
        die(json_encode($statements));
        
        $statements = $this->Statements->find()->contain([
            
        ]);
        $this->set('statements', $statements);
        $this->set('_serialize', 'statements');
    }
    
    /*
     |--------------------------------------------------------------------
     | Create
     |--------------------------------------------------------------------
     */
    
    public function create()
    {
        $table = $this->Statements;
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
        $this->set('statement', $entity);
        $this->set('_serialize', 'statement');
    }
    
    /*
     |--------------------------------------------------------------------
     | Read
     |--------------------------------------------------------------------
     */
    
    public function read($id = null)
    {
        $table = $this->Statements;
        $entity = $table->get($id, [
            'contain' => [
                'Comments',
                'Comments.CreatedBy',
                'Attachments',
                'Attachments.CreatedBy',
            ]
        ]);
        $this->set('statement', $entity);
        $this->set('_serialize', 'statement');
    }
    
    /*
     |--------------------------------------------------------------------
     | View
     |--------------------------------------------------------------------
     */
    
    public function view($id = null)
    {
        $statement = $this->Statements->get($id, [
            'contain' => [
                'Investments',
                'Investments.Accounts',
                'Investments.Accounts.Investors',
            ]
        ]);
        $path = STATEMENTS . 
            $statement->investment->account->investor->ftp_folder .
            DS . $statement->name;
        $response = $this->response->withFile($path);
        return $response;
    }
    
    /*
     |--------------------------------------------------------------------
     | Update
     |--------------------------------------------------------------------
     */
    
    public function update($id = null)
    {
        $table = $this->Statements;
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
        $this->set('statement', $entity);
        $this->set('_serialize', 'statement');
    }
    
    /*
     |--------------------------------------------------------------------
     | Delete
     |--------------------------------------------------------------------
     */
    
    public function delete($id = null)
    {
        $table = $this->Statements;
        $entity = $table->get($id);
        if ($this->request->is(['delete', 'post'])) {
            if (!$table->delete($entity)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        $this->set('statement', $entity);
        $this->set('_serialize', 'statement');
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
     |--------------------------------------------------------------------
     | Sync FTP
     |--------------------------------------------------------------------
     */
    
    public function syncFtp()
    {
        $statements = $this->Statements
            ->find()
            ->where(['Statements.date' => '2017-09-01'])
            ->contain([
                'Investments' => [ 'fields' => [ 'id' ] ],
                'Investments.Accounts' => [ 'fields' => [ 'id' ] ],
                'Investments.Accounts.Investors' => [ 'fields' => [ 'ftp_folder' ] ]
            ]);
        
        $statementList = [];
        
        foreach ($statements as $statement) {
            
            $ftpDir = $statement->investment->account->investor->ftp_folder . DS;
            
            $dir = STATEMENTS . $ftpDir . $statement->name;
            
            $statementList[] = [
                'id' => $statement->id,
                'path' => $statement->investment->account->investor->ftp_folder . '/' . $statement->name
            ];
        }
        
        $this->set('statements', $statementList);
        
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
