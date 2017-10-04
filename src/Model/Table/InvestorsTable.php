<?php
/*
 |------------------------------------------------------------------------
 | Model\Table: Investors
 |------------------------------------------------------------------------
 */

namespace App\Model\Table;

use Cake\Event\Event;

class InvestorsTable extends Table
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
        $this->setTable('investors');
        
        // Behaviors
        $this->addBehavior('Timestamp');
        $this->addBehavior('Comments');
        $this->addBehavior('Attachments');
        $this->addBehavior('Ownership');
        
        // Associations
        $this->hasMany('Accounts');
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
        $query = $this->Accounts->find()->where(['investor_id' => $entity->id]);
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
    
    /*
     |--------------------------------------------------------------------
     | Rename FTP folder
     |--------------------------------------------------------------------
     */
    
    public function renameFtpFolder($entity)
    {
        
    }
    
    /*
     |--------------------------------------------------------------------
     | After save
     |--------------------------------------------------------------------
     */
    
    public function afterSave(Event $event, $entity, $options)
    {
        if ($entity->isNew()) {
            $this->Accounts->createFromInvestor($entity);
        } else {
            if ($entity->changed('ftp_folder')) {
                $this->renameFtpFolder($entity);
            }
         }
    }
}
