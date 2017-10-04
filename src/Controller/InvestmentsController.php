<?php
/*
 |------------------------------------------------------------------------
 | Controller: Investments controller
 |------------------------------------------------------------------------
 */

namespace App\Controller;

use DateTime;
use App\Controller\AppController;
use Cake\Event\Event;
use Dompdf\Dompdf;
use Cake\Chronos\MutableDate;
use Cake\Chronos\Date;

class InvestmentsController extends AppController
{
    /*
     |--------------------------------------------------------------------
     | Index
     |--------------------------------------------------------------------
     */
    
    public function index()
    {
        $table = $this->Investments;
        $accountsTable = $table->Accounts;
        $offeringsTable = $table->Offerings;
        $fields = [
            'id', 'client_id', 'account_id', 'offering_id', 'date', 'amount', 'balance'
        ];
        $contain = [
            'Offerings' => [
                'fields' => [
                    'Offerings.date',
                    'Offerings.rate' 
                ]
            ],
            'Offerings.Funds' => [
                'fields' => [ 'Funds.name' ]
            ],
            'Accounts' => [
                'fields' => [ 'Accounts.name' ]
            ],
            'Accounts.Investors' => [
                'fields' => [ 'Investors.name' ]
            ],
        ];
        $entities = $table->find()->select($fields)->contain($contain);
        foreach ($entities as $entity) {
            $account = $entity->account;
            $entity['fund.name'] = $entity->offering->fund->name;
            $entity['account.name'] = $account->name;
            $entity['investor.name'] = $account->investor->name;
            $entity['offering_fund_name'] = $entity->offering->fund->name;
            $entity['account_name'] = $account->name;
            $entity['account_investor_name'] = $account->investor->name;
        }
        $this->set('investments', $entities);
        $this->set('funds', $offeringsTable->Funds->find());
        $this->set('accounts', $accountsTable->find());
        $this->set('offerings', $offeringsTable->find());
        $this->set('investors', $accountsTable->Investors->find());
        $this->set('_serialize', 'investments');
    }
    
    /*
     |--------------------------------------------------------------------
     | Create
     |--------------------------------------------------------------------
     */
    
    public function create()
    {
        $table = $this->Investments;
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
            $entity = $table->get($entity->id, [
                'contain' => [
                    'Offerings',
                    'Offerings.Funds',
                    'Accounts',
                    'Accounts.Investors'
                ]
            ]);
            $entity['fund.name'] = $entity->offering->fund->name;
            $entity['account.name'] = $entity->account->name;
            $entity['investor.name'] = $entity->account->investor->name;
        }
        $this->set('investment', $entity);
        $this->set('_serialize', 'investment');
    }
    
    /*
     |--------------------------------------------------------------------
     | Read
     |--------------------------------------------------------------------
     */
    
    public function read($id = null)
    {
        $table = $this->Investments;
        $accountsTable = $table->Accounts;
        $offeringsTable = $table->Offerings;
        $entity = $table->get($id, [
            'contain' => [
                'Accounts',
                'Accounts.Investors',
                'Offerings',
                'Offerings.Funds',
                'Transactions',
                'Statements',
                'Comments',
                'Comments.CreatedBy',
                'Attachments',
                'Attachments.CreatedBy',
            ]
        ]);
        $this->set('investment', $entity);
        $this->set('funds', $offeringsTable->Funds->find());
        $this->set('accounts', $accountsTable->find());
        $this->set('offerings', $offeringsTable->find());
        $this->set('investors', $accountsTable->Investors->find());
        $this->set('_serialize', 'investment');
    }
    
    /*
     |--------------------------------------------------------------------
     | Update
     |--------------------------------------------------------------------
     */
    
    public function update($id = null)
    {
        $table = $this->Investments;
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
            $entity = $table->get($entity->id, [
                'contain' => [ 'Transactions' ]
            ]);
        }
        $this->set('investment', $entity);
        $this->set('_serialize', 'investment');
    }
    
    /*
     |--------------------------------------------------------------------
     | Delete
     |--------------------------------------------------------------------
     */
    
    public function delete($id = null)
    {
        $table = $this->Investments;
        $entity = $table->get($id);
        if ($this->request->is(['delete', 'post'])) {
            if (!$table->delete($entity)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        $this->set('investment', $entity);
        $this->set('_serialize', 'investment');
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
        $query = $this->Investments->find()->contain([
            'Offerings',
            'Offerings.Funds',
            'Accounts',
            'Accounts.Investors'
        ]);
        $where = $this->request->query('where');
        $select = $this->request->query('select');
        if ($where) $query->where($where);
        if ($select) $query->select($select);
        
        // Header row
        $csv = $this->Csv->line([
            'id',
            'client_id',
            'date',
            'amount',
            'term',
            'balance',
            'fund_id',
            'offering_id',
            'fund_name',
            'offering_rate',
            'investor_id',
            'account_id',
            'investor_name',
            'account_name',
        ]);
        
        // Body rows
        foreach ($query as $entity) {
            $csv .= $this->Csv->line([
                $entity->id,
                $entity->client_id,
                $entity->date,
                $entity->amount,
                $entity->term,
                $entity->balance,
                $entity->offering->fund->id,
                $entity->offering->id,
                $entity->offering->fund->name,
                $entity->offering->rate / 100,
                $entity->account->investor->id,
                $entity->account->id,
                $entity->account->investor->name,
                $entity->account->name,
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
     | Sync statements
     |--------------------------------------------------------------------
     */
    
    public function syncStatements($id = null)
    {
        $investment = $this->Investments->get($id, [
            'contain' => [
                'Statements'
            ]
        ]);
        
        $needed = [];
        $completed = [];
        foreach ($investment->statements as $statement) {
            $completed[] = $statement->date->format('Y-m-d');
        }
        
        $end = new MutableDate();
        $end->startOFMonth();
        $end = $end->min($investment->statements_end);
        $date = $investment->statements_start->toMutable();
        
        while ($date->lte($end)) {
            if (!in_array($date->format('Y-m-d'), $completed)) {
                if ($this->request->is('post')) {
                    
                } else {
                    $needed[] = $date->format('Y-m-d');
                }
            }
            $date->addMonth(1);
        }
        
        $investment->completed = $completed;
        
        $this->set('needed', $needed);
        $this->set('_serialize', 'needed');
    }
    
    /*
     |--------------------------------------------------------------------
     | PDF
     |--------------------------------------------------------------------
     */
    
    public function pdf($id)
    {
        $pdf = new Pdf();
        $pdf->addPage('http://app/fund-manager/investments/statement/1');
        $pdf->send();
        die();
    }
    
    /*
     |--------------------------------------------------------------------
     | Statement
     |--------------------------------------------------------------------
     */
    
    public function statement($id = null)
    {
        $investment = $this->Investments->get($id, [
            'contain' => [
                'Accounts',
                'Offerings',
                'Transactions' => [
                    'queryBuilder' => function ($q) {
                        return $q->order([
                            'Transactions.date' =>'ASC'
                        ]);
                    }
                ],
                'Accounts.Investors',
                'Offerings.Funds'
            ],
        ]);
        
        $loader = new \Twig\Loader\FilesystemLoader(APP . 'Template' . DS);
        $twig = new \Twig\Environment($loader, [/*'cache' => CACHE . 'twig'*/]);
        
        $html = $twig->render('Investments/statement.html', [
            'date' => (new DateTime())->format('m/d/Y'),
            'investment' => $investment,
            'offering' => $investment->offering,
            'fund' => $investment->offering->fund,
            'account' => $investment->account,
            'investor' => $investment->account->investor,
            'transactions' => $investment->transactions,
        ]);
        
        $dompdf = new Dompdf();
        $dompdf->loadHtml($html);
        $dompdf->render();
        $pdf = $dompdf->output();
        
        $response = $this->response;
        $response->body($pdf);
        $response = $response->withType('pdf');
        
        return $response;
        
        die();
        /*
        $descriptorspec = array(
            0 => array('pipe', 'r'), // stdin
            1 => array('pipe', 'w'), // stdout
            2 => array('pipe', 'w'), // stderr
        );
        $process = proc_open('wkhtmltopdf -q - -', $descriptorspec, $pipes, null, null, [
            'bypass_shell' => true
        ]);
        
        usleep(2000);
        fwrite($pipes[0], $html);
        
        $pdf = stream_get_contents($pipes[1]);
        $errors = stream_get_contents($pipes[2]);
        
        fclose($pipes[0]);
        fclose($pipes[1]);
        $retval = proc_close($process);
        
        if ($errors) {
            throw new \Exception('PDF generation failed: ' . $errors);
        } else {
            header('Content-Type: application/pdf');
            header('Cache-Control: public, must-revalidate, max-age=0'); // HTTP/1.1
            header('Pragma: public');
            header('Expires: Sat, 26 Jul 1997 05:00:00 GMT'); // Date in the past
            header('Last-Modified: ' . gmdate('D, d M Y H:i:s').' GMT');
            header('Content-Length: ' . strlen($pdf));
            header('Content-Disposition: inline; filename="' . 'sample.pdf' . '";');
            echo $pdf;
        }
        
        die();
        
        $this->set('investment', $investment);
        $this->set('_serialize', 'investment');
        */
    }
    
    /*
     |--------------------------------------------------------------------
     | Apply transactions
     |--------------------------------------------------------------------
     */
    
    public function applyTransactions($date = null)
    {
        $date = new Date($date);
        $date = ($date->day < 15 ? $date->subMonths(1) : $date)->endOfMonth();
        $request = $this->request;
        $transactionsTable = $this->Investments->Transactions;
        
        if ($request->is(['post'])) {
            $transactions = [];
            $records = $request->data('json');
            $records = json_decode($records);
            foreach ($records as $record) {
                $transaction = $transactionsTable->newEntity([
                    'investment_id' => $record->investment_id,
                    'date' => $record->date,
                    'type' => $record->type,
                    'amount' => $record->amount,
                ]);
                $transactions[] = $transaction;
            }
            $transactionsTable->saveMany($transactions);
            $this->set('transactions', $transactions);
            $this->set('_serialize', 'transactions');
        }
        
        $this->set('date', $date);
    }
    
    /*
     |--------------------------------------------------------------------
     | Calculate payments
     |--------------------------------------------------------------------
     */
    
    public function calculateTransactions($date = null)
    {
        $date = new Date($date);
        $start = $date->startOfMonth();
        $end = $date->endOfMonth();
        
        $where = [ 'status' => 1 ];
        $select = ['id', 'client_id', 'amount', 'date', 'term', 'maturity', 'balance', 'preferred_payment'];
        $contain = [
            'Offerings' => function ($query) {
                return $query->select(['rate', 'fund_id']);
            },
            'Offerings.Funds' => function ($query) {
                return $query->select(['name']);
            },
            'Accounts' => function ($query) {
                return $query->select(['name', 'investor_id']);
            },
            'Accounts.Investors' => function ($query) {
                return $query->select(['name']);
            },
            'Transactions' => function ($query) {
                return $query
                    ->select(['investment_id', 'type', 'date', 'amount'])
                    ->order(['date' => 'ASC']);
            },
        ];
        
        $investments = $this->Investments->find()
            ->select($select)
            ->where($where)
            ->contain($contain);
        
        function baseTransaction ($investment) {
            return (object)[
                'investment_id' => $investment->id,
                'date' => null,
                'amount' => null,
                'type' => null,
                'client_id' => $investment->client_id,
                'investment_amount' => $investment->amount,
                'investment_date' => $investment->date,
                'investment_term' => $investment->term,
                'investment_balance' => $investment->balance,
                'investment_rate' => $investment->offering->rate,
                'fund_name' => $investment->offering->fund->name,
                'investor_name' => $investment->account->investor->name,
                'account_name' => $investment->account->name
            ];
        }
        
        function perdiem ($amount, $rate) {
            return ($amount * ($rate / 100)) / 12 / 30;
        }
        
        function firstPayment ($date, $balance, $rate) {
            return round((30 - $date->day) * perdiem($balance, $rate), 2);
        }
        
        function lastPayment ($date, $balance, $rate) {
            return round($date->day * perdiem($balance, $rate), 2);
        }
        
        function drawdown ($date, $balance, $rate, $damount, $ddate) {
            $amount = round(($ddate->day - $date->day) * perdiem($balance, $rate), 2);
            return [ $amount, max(0, $balance - $damount) ];
        }
        
        $transactions = [];
        foreach ($investments as $investment) {
            $complete = false;
            $drawdowns = [];
            if ($investment->date->gt($end)) continue;
            foreach ($investment->transactions as $trans) {
                if ($complete) continue;
                if ($trans->type == 3 && $trans->date->between($start, $end)) {
                    $drawdowns[] = $trans;
                } elseif (($trans->type == 1 || $trans->type == 2) && $trans->date->between($start, $end)) {
                    $complete = true;
                }
            }
            if ($complete) continue;
            if ($investment->date->between($start, $end)) {
                // Prorated first payment
                $amount = firstPayment(
                    $investment->date,
                    $investment->amount,
                    $investment->offering->rate
                );
                if ($amount <= 0) continue;
                $transaction = baseTransaction($investment);
                $transaction->date = $end->format('Y-m-d');
                $transaction->type = 1;
                $transaction->amount = $amount;
                $transactions[] = $transaction;
            } elseif (count($drawdowns) > 0) {
                // Drawdown calculation
                $date = $start;
                foreach ($drawdowns as $drawdown) {
                    list($amount, $balance) = drawdown(
                        $date,
                        $investment->balance,
                        $investment->offering->rate,
                        $drawdown->amount,
                        $drawdown->date
                    );
                    if ($amount > 0) {
                        $transaction = baseTransaction($investment);
                        $transaction->date = $drawdown->date->format('Y-m-d');
                        $transaction->type = 1;
                        $transaction->amount = $amount;
                        $transactions[] = $transaction;
                    }
                    $date = $drawdown->date;
                    $investment->balance = $balance;
                }
                if ($investment->balance > 0) {
                    $amount = firstPayment(
                        $date,
                        $investment->balance,
                        $investment->offering->rate
                    );
                    if ($amount <= 0) continue;
                    $transaction = baseTransaction($investment);
                    $transaction->date = $end->format('Y-m-d');
                    $transaction->type = 1;
                    $transaction->amount = $amount;
                    $transactions[] = $transaction;
                }
            } elseif ($investment->maturity->between($start, $end)) {
                // Prorated last payment
                $amount = lastPayment(
                    $investment->maturity,
                    $investment->balance,
                    $investment->offering->rate
                );
                if ($amount > 0) {
                    $transaction = baseTransaction($investment);
                    $transaction->date = $investment->maturity->format('Y-m-d');
                    $transaction->type = 1;
                    $transaction->amount = $amount;
                    $transactions[] = $transaction;
                }
                // Drawdown balance
                $transaction = baseTransaction($investment);
                $transaction->date = $investment->maturity->format('Y-m-d');
                $transaction->type = 3;
                $transaction->amount = $investment->balance;
                $transactions[] = $transaction;
            } else {
                // Standard payment
                $transaction = baseTransaction($investment);
                $transaction->date = $end->format('Y-m-d');
                $transaction->type = 2;
                $transaction->amount = $investment->preferred_payment;
                $transactions[] = $transaction;
            }
        }
        
        $this->set('transactions', $transactions);
        $this->set('_serialize', 'transactions');
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
        $this->Auth->allow(['statement']);
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
