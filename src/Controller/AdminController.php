<?php
/*
 |-----------------------------------------------------------------------------
 | Controller: Admin controller
 |-----------------------------------------------------------------------------
 */
namespace App\Controller;

use App\Controller\AppController;
use Cake\ORM\TableRegistry;
use Cake\Chronos\Date;
use Cake\Chronos\MutableDate;
use Dompdf\Dompdf;
use Cake\Utility\Text;

class AdminController extends AppController
{
    /*
     |-------------------------------------------------------------------------
     | Index
     |-------------------------------------------------------------------------
     */
    
    public function index()
    {

    }
    
    /*
     |-------------------------------------------------------------------------
     | Users: Index
     |-------------------------------------------------------------------------
     */
    
    public function users()
    {
        $usersTable = TableRegistry::get('Users');
        $users = $usersTable->find();
        $this->set('users', $users);
    }
    
    /*
     |-------------------------------------------------------------------------
     | Users: Register
     |-------------------------------------------------------------------------
     */
    
    public function usersRegister()
    {
        $usersTable = TableRegistry::get('Users');
        if ($this->request->is('post')) {
            $role = $this->request->data('role');
            $email = $this->request->data('username');
            $email2 = $this->request->data('username2');
            if (!$email) {
                $this->set('error', 'No email address provided');
                return;
            }
            if ($email !== $email2) {
                $this->set('error', 'Email addresses did not match');
                return;
            }
            $users = $usersTable->find()->where(['username' => $email]);
            if ($users->count() > 0) {
                $this->set('error', 'The user <' . $email . '> already exists');
                return;
            }
            $user = $usersTable->newEntity([
                'role' => $role,
                'username' => $email,
            ]);
            $usersTable->save($user);
        }
    }
    
    
    
    
    
    
    
    
    public function seedMaturity()
    {
        $investmentsTable = TableRegistry::get('Investments');
        $investments = $investmentsTable->find();
        foreach ($investments as $investment) {
            $investment->maturity = $investment->date->addMonths(36);
            $investmentsTable->save($investment);
        }
    }
    
    public function seedStatements()
    {
        set_time_limit(0);
        $months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        
        $statementsTable = TableRegistry::get('Statements');
        $investmentsTable = TableRegistry::get('Investments');
        $investments = $investmentsTable->find()->order(['Investments.date' => 'ASC'])->contain([
            'Transactions' => [
                'queryBuilder' => function ($q) {
                    return $q->order([
                        'Transactions.date' =>'ASC'
                    ]);
                }
            ],
            'Offerings',
            'Offerings.Funds',
            'Accounts',
            'Accounts.Investors'
        ]);
        $dates = [];
        $today = new MutableDate();
        $today->startOfMonth();
        foreach ($investments as $investment) {
            
            $statementsByDate = [];
            $statements = $statementsTable->find()->where([
                'investment_id' => $investment->id
            ]);
            
            foreach ($statements as $statement) {
                $statementsByDate[$statement->date->format('Y-m')] = $statement;
            }
            
            $date = $investment->statements_start->toMutable();
            if ($date->gt($today)) continue;
            $end = $today->min($investment->statements_end);
            while ($date->lte($end)) {
                if (!array_key_exists($date->format('Y-m'), $statementsByDate)) {
                    
                    $asof = new MutableDate($date);
                    $asof->subDay(1);
                    
                    $dir = $investment->account->investor->ftp_folder;
                    $clientId = $investment->client_id;
                    $content = $this->createStatement($investment, $asof);
                    
                    $name = implode(' - ', [
                        $clientId, $asof->format('Y'), $months[$asof->month -1]
                    ]) . '.pdf';
                    $path = STATEMENTS . $dir . DS . $name;
                    
                    if (!file_exists(STATEMENTS . $dir)) {
                        mkdir(STATEMENTS . $dir);
                    }
                    
                    $handle = fopen($path, 'w');
                    fwrite($handle, $content);
                    fclose($handle);
                    
                    $statement = $statementsTable->newEntity([
                        'investment_id' => $investment->id,
                        'date' => $date,
                        'name' => $name,
                        'size' => filesize($path)
                    ]);
                    
                    $statementsTable->save($statement);
                }
                $date->addMonth(1);
            }
        }
    }
    
    public function createStatement($investment, $date)
    {
        $loader = new \Twig\Loader\FilesystemLoader(APP . 'Template' . DS);
        $twig = new \Twig\Environment($loader, [/*'cache' => CACHE . 'twig'*/]);
        
        $transactions = [];
        $balance = $investment->amount;
        foreach ($investment->transactions as $transaction) {
            if ($transaction->date->lte($date)) {
                if ($transaction->type == 3) {
                    $balance = $balance - $transaction->amount;
                }
                $transactions[] = $transaction;
            }
        }
        $investment->balance = $balance;
        
        $html = $twig->render('Investments/statement.html', [
            'date' => $date->format('m/d/Y'),
            'investment' => $investment,
            'offering' => $investment->offering,
            'fund' => $investment->offering->fund,
            'account' => $investment->account,
            'investor' => $investment->account->investor,
            'transactions' => $transactions,
        ]);
        
        $dompdf = new Dompdf();
        $dompdf->loadHtml($html);
        $dompdf->render();
        return $dompdf->output();
        
    }
    
    public function seedClosedDates()
    {
        $investmentsTable = TableRegistry::get('Investments');
        $investments = $investmentsTable->find()->contain([
            'Transactions' => [
                'queryBuilder' => function ($q) {
                    return $q->where(['type' => 3])->order([
                        'Transactions.date' =>'DESC'
                    ]);
                }
            ],
        ]);
        
        foreach ($investments as $investment) {
            if ($investment->status == 2) {
                $transaction = $investment->transactions[0];
                $date = $transaction->date->toMutable();
                $investment->closed = $date;
                $investmentsTable->save($investment);
            }
        }
    }
    
    public function seedStatementDates()
    {
        $investmentsTable = TableRegistry::get('Investments');
        $investments = $investmentsTable->find()->contain([
            'Transactions' => [
                'queryBuilder' => function ($q) {
                    return $q->where(['type' => 3])->order([
                        'Transactions.date' =>'DESC'
                    ]);
                }
            ],
        ]);
        
        foreach ($investments as $investment) {
            $date = $investment->date->toMutable();
            $date->endOfMonth();
            $date->addDay(1);
            if ($investment->status == 2) {
                $end = $investment->closed->toMutable();
                $end->addMonth(1);
            } else {
                $end = new MutableDate($date);
                $end->addMonth(36);
            }
            $end->startOfMonth();
            $investment->statements_start = $date;
            $investment->statements_end = $end;
            $investmentsTable->save($investment);
        }
    }
    
    public function seedTransactions()
    {
        set_time_limit(0);
        $investments = TableRegistry::get('Investments')->find()->contain([
            'Transactions',
            'Offerings'
        ]);
        $transactionsTable = TableRegistry::get('Transactions');
        foreach ($investments as $investment) {
            
            $newTransactions = [];
            $payments = [];
            $drawdowns = [];
            foreach ($investment->transactions as $transaction) {
                if ($transaction->type == 2) {
                    $payments[$transaction->date->format('m-Y')] = $transaction;
                }
                if ($transaction->type == 3) {
                    $drawdowns[$transaction->date->format('m-Y')] = $transaction;
                }
            }
            
            $date = $investment->date->toMutable();
            $date->addMonth(1);
            $date->endOfMonth(); 
            $end = new MutableDate('2017-07-31');
            $rate = $investment->offering->rate / 100;
            $balance = $investment->amount;
            $payment = round(($balance * $rate) / 12, 2);
            
            while ($end->gte($date)) {
                if ($balance > 0 && !array_key_exists($date->format('m-Y'), $payments)) {
                    if (array_key_exists($date->format('m-Y'), $drawdowns)) {
                        $day = (int)$transaction->date->format('d');
                        if ($day >= 30) {
                            $newTransactions[] = [
                                'date' => $date->format('Y-m-d'),
                                'amount' => $payment,
                                'type' => 2
                            ];
                        } else {
                            $transaction = $drawdowns[$date->format('m-Y')];
                            $newTransactions[] = [
                                'date' => $transaction->date->format('Y-m-d'),
                                'amount' => round(($payment/30) * $day, 2),
                                'type' => 1
                            ];
                            $balance = $balance - $transaction->amount;
                            if ($balance == 0) {
                                break;
                            }
                            $payment = round(($balance * $rate) / 12, 2);
                            $newTransactions[] = [
                                'date' => $date->format('Y-m-d'),
                                'amount' => round(($payment/30) * (30-$day), 2),
                                'type' => 1
                            ];
                        }
                    } else {
                        $newTransactions[] = [
                            'date' => $date->format('Y-m-d'),
                            'amount' => $payment,
                            'type' => 2
                        ];
                    }
                }
                $date->addMonth(1);
                $date->endOfMonth();
            }
            
            foreach ($newTransactions as $newTransaction) {
                $newTransaction['investment_id'] = $investment->id;
                $newTransaction['created_by_id'] = 1;
                $newTransaction['modified_by_id'] = 1;
                $transaction = $transactionsTable->newEntity($newTransaction);
                $transactionsTable->save($transaction);
            }
            
        }
    }
    
    
    public function mapFtp ()
    {
        set_time_limit(0);
        
        $handle = ftp_connect('pprnoteco.com');
        ftp_login($handle, 'statements', 'uP-jAd-nEb-naj-hoY');
        ftp_pasv($handle, true);
        
        $statementsTable = TableRegistry::get('Statements');
        $statements = $statementsTable->find()->where([
            'Statements.date' => '2017-09-01'
        ])->contain([
            'Investments',
            'Investments.Accounts',
            'Investments.Accounts.Investors'
        ]);
        
        echo "<ul>";
        
        foreach ($statements as $statement) {
            
            $ftpdir = $statement->investment->account->investor->ftp_folder;
            
            echo "<li>" . STATEMENTS . $ftpdir . DS . $statement->name;
            echo " -- ";
            echo "./" . $ftpdir . '/' . $statement->name;
            echo "</li>";
            
            $fp = fopen(STATEMENTS . $ftpdir . DS . $statement->name, 'r');
            ftp_fput($handle, "./" . $ftpdir . '/' . $statement->name, $fp, FTP_BINARY);
            
        }
        
        echo "</ul>";
        
        ftp_close($handle);
        die();
    }
    
    public function isAuthorized($user = null)
    {
        return true;
    }
}
