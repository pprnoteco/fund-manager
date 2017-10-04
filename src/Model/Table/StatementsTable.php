<?php
/*
 |------------------------------------------------------------------------
 | Model\Table: Statements
 |------------------------------------------------------------------------
 */

namespace App\Model\Table;

use Cake\Chronos\MutableDate;

class StatementsTable extends Table
{
    /*
     |--------------------------------------------------------------------
     | Initialize
     |--------------------------------------------------------------------
     */
    
    public function initialize(array $config)
    {
        // Table
        $this->setPrimaryKey('id');
        $this->setTable('statements');
        
        // Behaviors
        $this->addBehavior('Timestamp');
        $this->addBehavior('Ownership');
        
        // Associations
        $this->belongsTo('Investments');
    }
    
    /*
     |--------------------------------------------------------------------
     | Incorrect before
     |--------------------------------------------------------------------
     */
    
    public function incorrectBefore($investment_id, $date = null)
    {
        $date = $date ? $date : new MutableDate();
        $date->startOfMonth();
        $statements = $this->find()->where([
            'investment_id' => $investment_id,
            'date <=' => $date
        ]);
        foreach ($statements as $statement) {
            $statement->correct = false;
        }
        $this->Statements->saveMany($statements);
    }
}
