<?php
/*
 |------------------------------------------------------------------------
 | Model\Table: Accounts
 |------------------------------------------------------------------------
 */
namespace App\Model\Table;

use Cake\Event\Event;
use Cake\Event\EventManager;

class AccountsTable extends Table
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
        $this->setTable('accounts');
        
        // Behaviors
        $this->addBehavior('Timestamp');
        $this->addBehavior('Comments');
        $this->addBehavior('Attachments');
        $this->addBehavior('Ownership');
        
        // Associations
        $this->belongsTo('Investors');
        $this->hasMany('Investments');
    }
    
    /*
     |--------------------------------------------------------------------
     | Create from investor
     |--------------------------------------------------------------------
     */
    
    public function createFromInvestor($investor)
    {
        $account = $this->newEntity([
            'investor_id' => $investor->id,
            'type' => 1,
            'name' => $investor->name,
            'address' => $investor->address,
            'city' => $investor->city,
            'state' => $investor->state,
            'zip' => $investor->zip
        ]);
        $this->save($account);
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
        $query = $this->Investments->find()->where(['account_id' => $entity->id]);
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
        $this->Investors->updateCachedFields($entity->investor_id);
    }
    
}
