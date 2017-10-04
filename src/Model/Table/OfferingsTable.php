<?php
/*
 |------------------------------------------------------------------------
 | Model\Table: Offerings
 |------------------------------------------------------------------------
 */

namespace App\Model\Table;

class OfferingsTable extends Table
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
        $this->setTable('offerings');
        
        // Behaviors
        $this->addBehavior('Timestamp');
        $this->addBehavior('Comments');
        $this->addBehavior('Attachments');
        $this->addBehavior('Ownership');
        
        // Associations
        $this->belongsTo('Funds');
        $this->hasMany('Investments');
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
        $query = $this->Investments->find()->where(['offering_id' => $entity->id]);
        $total = $query->select([
            'count' => $query->func()->count('id'),
            'amount' => $query->func()->sum('amount'),
            'balance' => $query->func()->sum('balance'),
        ])->first();
        $entity->investments_count = $total->count;
        $entity->investments_amount = $total->amount;
        $entity->investments_balance = $total->balance;
        $this->save($entity);
        $this->updateAssociatedCachedFields($entity);
        return $entity;
    }
    
    /*
     |--------------------------------------------------------------------
     | Update associated cached fields
     |--------------------------------------------------------------------
     */
    
    public function updateAssociatedCachedFields($entity)
    {
        if (!($entity instanceof \Cake\Datasource\EntityInterface)) {
            $entity = $this->get($entity);
        }
        $this->Funds->updateCachedFields($entity->fund_id);
    }
}
