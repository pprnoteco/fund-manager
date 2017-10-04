<?php
/*
 |------------------------------------------------------------------------
 | Model\Table: Users
 |------------------------------------------------------------------------
 */

namespace App\Model\Table;

use Cake\Auth\DefaultPasswordHasher;
use Cake\Event\Event;
use Cake\Mailer\Email;
use Cake\ORM\Rule\IsUnique;
use Cake\ORM\RulesChecker;
use Cake\Utility\Text;
use Cake\Validation\Validator;

class UsersTable extends Table
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
        $this->setTable('users');
        
        // Behaviors
        $this->addBehavior('Timestamp');
        $this->addBehavior('Comments');
        $this->addBehavior('Attachments');
    }
    
    /*
     |--------------------------------------------------------------------
     | Registration email
     |--------------------------------------------------------------------
     */
    
    public function registrationEmail($entity)
    {
        $email = new Email('default');
        if ($entity->password) {
            $email
            ->subject('Fund manager: verify email address')
            ->template('verify-email', 'default');
        } else {
            $email
            ->subject('Fund manager: your account is ready')
            ->template('account-ready', 'default');
        }
        $email
        ->set('user', $entity)
        ->emailFormat('html')
        ->from(['funds.pprdomain@gmail.com' => 'Fund manager'])
        ->to($entity->username)
        ->send();
    }
    
    /*
     |--------------------------------------------------------------------
     | Username exists
     |--------------------------------------------------------------------
     */
    
    public function usernameExists($entity)
    {
        return $this->find()->where(['username' => $entity->username])->count() > 0;
    }
    
    /*
     |--------------------------------------------------------------------
     | Username available
     |--------------------------------------------------------------------
     */
    
    public function usernameAvailable($entity) {
        return !$this->usernameExists($entity);
    }
    
    /*
     |--------------------------------------------------------------------
     | Before save
     |--------------------------------------------------------------------
     */
    
    public function beforeSave(Event $event, $entity, $options)
    {
        if ($entity->isNew()) {
            $entity->token = Text::uuid();
            if (!isset($entity->role)) $entity->role = 1;
            if (!$entity->password) {
                $entity->token_type = 'activate';
            } else {
                $entity->token_type = 'verify-email';
                $entity->password = (new DefaultPasswordHasher)->hash($entity->password);
            }
        }
    }
    
    /*
     |--------------------------------------------------------------------
     | After save
     |--------------------------------------------------------------------
     */
    
    public function afterSave(Event $event, $entity, $options)
    {
        if ($entity->isNew()) {
            $this->registrationEmail($entity);
        }
    }
    
    /*
     |--------------------------------------------------------------------
     | Validation default
     |--------------------------------------------------------------------
     */
    
    public function validationDefault(Validator $validator)
    {
        // Validate username
        $validator->requirePresence('username', 'create');
        $validator->notEmpty('username', 'The username cannot be empty');
        $validator->email('username', false, 'The username must be a valid email address');
        
        // Validate password
        //$validator->requirePresence('password', 'create');
        //$validator->notEmpty('password', 'The password cannot be empty');
        //$validator->minLength('password', 5, 'The password must be more than 4 characters');
        //$validator->maxLength('password', 250, 'The password must be less than 250 characters');
        
        return $validator;
    }
    
    /*
     |--------------------------------------------------------------------
     | Build rules
     |--------------------------------------------------------------------
     */
    
    public function buildRules(RulesChecker $rules)
    {
        // Unique username
        $rules->addCreate([$this, 'usernameAvailable'], 'unique', [
            'errorField' => 'username',
            'message' => 'This username already exists'
        ]);
        return $rules;
    }
}
