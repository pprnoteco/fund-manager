<?php
/*
 |------------------------------------------------------------------------
 | Model\Table: Investments
 |------------------------------------------------------------------------
 */

namespace App\Model\Table;

use Cake\Chronos\Date;
use Cake\Datasource\EntityInterface;
use Cake\Event\Event;

class InvestmentsTable extends Table
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
        $this->setTable('investments');
        
        // Behaviors
        $this->addBehavior('Timestamp');
        $this->addBehavior('Comments');
        $this->addBehavior('Attachments');
        $this->addBehavior('Ownership');
        
        // Associations
        $this->belongsTo('Accounts');
        $this->belongsTo('Offerings');
        $this->hasMany('Transactions');
        $this->hasMany('Statements');
    }
    
    /*
     |--------------------------------------------------------------------
     | Generate client id
     |--------------------------------------------------------------------
     */
    
    public function generateClientId()
    {
        $date = (new Date())->startOfYear();
        $where = [ 'date >=' => $date ];
        $order = [ 'client_id' => 'DESC' ];
        $entity = $this->find()->where($where)->order($order)->first();
        if (!$entity) {
            $increment = 1;
        } else {
            $increment = ((int) substr($entity->client_id, 2)) + 1;
        }
        $increment = str_pad($increment, 4, '0', STR_PAD_LEFT);
        return substr($date->format('Y'), -2) . $increment;
    }
    
    /*
     |--------------------------------------------------------------------
     | Drawdown
     |--------------------------------------------------------------------
     */
    
    public function drawdown($entity, $transaction)
    {
        if (!($entity instanceof \Cake\Datasource\EntityInterface)) {
            $entity = $this->get($entity);
        }
        $this->processBalance($entity);
        $this->save($entity);
    }
    
    /*
     |--------------------------------------------------------------------
     | Process balance
     |--------------------------------------------------------------------
     */
    
    public function processBalance($entity)
    {
        if (!($entity instanceof \Cake\Datasource\EntityInterface)) {
            $entity = $this->get($entity);
        }
        $query = $this->Transactions->find()->where([
            'type' => 3,
            'investment_id' => $entity->id
        ]);
        $total = $query->select([
            'date' => $query->func()->max('date'),
            'amount' => $query->func()->sum('amount')
        ])->first();
        $entity->balance = $entity->amount - $total->amount;
        $this->processStatus($entity, $total->date);
        $this->processPreferredPayment($entity);
        return $entity;
    }
    
    /*
     |--------------------------------------------------------------------
     | Process status
     |--------------------------------------------------------------------
     */
    
    public function processStatus($entity, $date)
    {
        if ($entity->balance <= 0) {
            $entity->balance = 0;
            $entity->status = 2;
            $entity->closed = $date;
        } else {
            $entity->status = 1;
            $entity->closed = null;
        }
        return $entity;
    }
    
    /*
     |--------------------------------------------------------------------
     | Process status
     |--------------------------------------------------------------------
     */
    
    public function processPreferredPayment($entity)
    {
        if ($entity->balance <= 0) {
            $entity->preferred_payment = 0;
        } else {
            $offering = $this->Offerings->get($entity->offering_id);
            $rate = $offering->rate / 100;
            $entity->preferred_payment = round(($entity->balance * $rate) / 12, 2);
        }
        return $entity;
    }
    
    /*
     |--------------------------------------------------------------------
     | Update parent cached fields
     |--------------------------------------------------------------------
     */
    
    public function updateAssociatedCachedFields($entity)
    {
        $this->Accounts->updateCachedFields($entity->account_id);
        $this->Offerings->updateCachedFields($entity->offering_id);
    }
    
    /*
     |--------------------------------------------------------------------
     | Before save
     |--------------------------------------------------------------------
     */
    
    public function beforeSave(Event $event, $entity, $options)
    {
        if ($entity->isNew()) {
            if (!$entity->date) $entity->date = new Date();
            if (!$entity->term) $entity->term = 36;
            $entity->status = 1;
            $entity->balance = $entity->amount;
            $this->processPreferredPayment($entity);
            $entity->client_id = $this->generateClientId();
        } else {
            if ($entity->changed(['amount'])) {
                $this->processBalance($entity);
            }
        }
        
        // Update statement range
        $start = $entity->date->endOfMonth()->addDays(1);
        $end = $entity->closed ? 
            $entity->closed->endOfMonth()->addDays(1) :
            $entity->date->addMonths($entity->term + 1)->startOfMonth();
        $entity->statements_start = $start;
        $entity->statements_end = $end;
    }
    
    /*
     |--------------------------------------------------------------------
     | After save
     |--------------------------------------------------------------------
     */
    
    public function afterSave(Event $event, $entity, $options)
    {
        if ($entity->isNew()) {
            $this->Transactions->createFromInvestment($entity);
            $this->updateAssociatedCachedFields($entity);
        } else {
            if ($entity->changed(['date', 'amount'])) {
                $this->Transactions->createFromInvestment($entity);
            }
            if ($entity->changed(['amount', 'balance', 'account_id', 'offering_id'])) {
                $this->updateAssociatedCachedFields($entity);
            }
        }
    }
    
    /*
     |--------------------------------------------------------------------
     | After delete
     |--------------------------------------------------------------------
     */
    
    public function afterDelete(Event $event, $entity, $options)
    {
        $this->updateAssociatedCachedFields($entity);
    }
}
