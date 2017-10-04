<?php
/*
 |------------------------------------------------------------------------
 | Model\Table: Transactions
 |------------------------------------------------------------------------
 */

namespace App\Model\Table;

use Cake\Event\Event;

class TransactionsTable extends Table
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
        $this->setTable('transactions');
        
        // Behaviors
        $this->addBehavior('Timestamp');
        $this->addBehavior('Comments');
        $this->addBehavior('Attachments');
        $this->addBehavior('Ownership');
        
        // Associations
        $this->belongsTo('Investments');
    }
    
    /*
     |--------------------------------------------------------------------
     | Initial deposit
     |--------------------------------------------------------------------
     */
    
    public function initialDeposit($investmentId)
    {
        $where = [
            'type' => 0,
            'investment_id' => $investmentId
        ];
        $order = [ 'date' => 'DESC' ];
        return $this->find()->where($where)->order($order)->first();
    }
    
    /*
     |--------------------------------------------------------------------
     | Create from investment
     |--------------------------------------------------------------------
     */
    
    public function createFromInvestment($investment)
    {
        $investmentId = $investment->id;
        $transaction = $this->initialDeposit($investmentId);
        if (!$transaction) {
            $transaction = $this->newEntity();
            $transaction->type = 0;
            $transaction->investment_id = $investmentId;
        }
        $transaction->date = $investment->date;
        $transaction->amount = $investment->amount;
        $this->save($transaction);
    }
    
    /*
     |--------------------------------------------------------------------
     | After save
     |--------------------------------------------------------------------
     */
    
    public function afterSave(Event $event, $entity, $options)
    {
        if ($entity->type == 3) {
            $this->Investments->drawdown($entity->investment_id, $entity);
        }
    }
    
    /*
     |--------------------------------------------------------------------
     | After delete
     |--------------------------------------------------------------------
     */
    
    public function afterDelete(Event $event, $entity, $options)
    {
        if ($entity->type == 3) {
            $entity->amount = 0;
            $this->Investments->drawdown($entity->investment_id, $entity);
        }
    }
}
