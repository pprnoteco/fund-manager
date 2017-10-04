<?php
/*
 |------------------------------------------------------------------------
 | Model\Table: Funds
 |------------------------------------------------------------------------
 */

namespace App\Model\Table;

class FundsTable extends Table
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
        $this->setTable('funds');
        
        // Behaviors
        $this->addBehavior('Timestamp');
        $this->addBehavior('Comments');
        $this->addBehavior('Attachments');
        $this->addBehavior('Ownership');
        
        // Associations
        $this->hasMany('Offerings');
    }
    
    /*
     |--------------------------------------------------------------------
     | Update cached fields
     |--------------------------------------------------------------------
     */
    
    public function updateCachedFields($entity)
    {
        if (!($entity instanceof \Cake\Datasource\EntityInterface)) {
            $entity = $this->get($entity);
        }
        $query = $this->Offerings->find()->where(['fund_id' => $entity->id]);
        $total = $query->select([
            'count' => $query->func()->sum('investments_count'),
            'amount' => $query->func()->sum('investments_amount'),
            'balance' => $query->func()->sum('investments_balance'),
        ])->first();
        $entity->investments_count = $total->count;
        $entity->investments_amount = $total->amount;
        $entity->investments_balance = $total->balance;
        $this->save($entity);
        return $entity;
    }
}
