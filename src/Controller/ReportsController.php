<?php
namespace App\Controller;

use Cake\ORM\TableRegistry;
use Cake\Chronos\Date;

class ReportsController extends AppController {
    
    public function index () {
        
        $investmentsTable = TableRegistry::get('Investments');
        $date = new Date();
        $date = $date->startOfMonth();
        $date = $date->subMonths(12);
        $capitalRaisedByMonth = [];
        for ($i = 0; $i < 12; $i++) {
            $date = $date->addMonths(1);
            $end  = $date->endOfMonth();
            $query = $investmentsTable->find();
            $capitalRaisedByMonth[$date->format('F, Y')] = $query
            ->select(['amount' => $query->func()->sum('amount')])
            ->where([
                'date >=' => $date,
                'date <=' => $end
            ])->first()->amount;
        }
        $this->set('capitalRaisedByMonth', $capitalRaisedByMonth);
        
    }
    
}
