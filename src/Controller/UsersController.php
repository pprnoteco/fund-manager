<?php
/*
 |------------------------------------------------------------------------
 | Controller: Users controller
 |------------------------------------------------------------------------
 */

namespace App\Controller;

use DateTime;
use App\Controller\AppController;
use App\Utility\Validation;
use Cake\Event\Event;
use Cake\Utility\Text;

use Cake\Auth\DefaultPasswordHasher;

class UsersController extends AppController
{
    /*
     |--------------------------------------------------------------------
     | Index
     |--------------------------------------------------------------------
     */
    
    public function index()
    {
        $users = $this->Users->find()->contain([
            
        ]);
        $this->set('users', $users);
        $this->set('_serialize', 'users');
    }
    
    /*
     |--------------------------------------------------------------------
     | Create
     |--------------------------------------------------------------------
     */
    
    public function create()
    {
        $user = $this->Users->newEntity();
        
        if ($this->request->is('post')) {
            $data = $this->request->getData();
            $user = $this->Users->patchEntity($user, $data);
            if (!$this->Users->save($user)) {
                $message = Validation::getFirstError(
                    $user,
                    ['username', 'password']
                );
                $this->set('error', $message);
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        
        $this->set('user', $user);
        $this->set('_serialize', 'user');
    }
    
    /*
     |--------------------------------------------------------------------
     | Read
     |--------------------------------------------------------------------
     */
    
    public function read($id = null)
    {
        $id = $id ? $id : $this->Auth->user('id');
        $user = $this->Users->get($id, [
            'contain' => [
                'Comments',
                'Comments.CreatedBy',
                'Attachments',
                'Attachments.CreatedBy',
            ]
        ]);
        $this->set('user', $user);
        $this->set('_serialize', 'user');
    }
    
    /*
     |--------------------------------------------------------------------
     | Update
     |--------------------------------------------------------------------
     */
    
    public function update($id = null)
    {
        $user = $this->Users->get($id);
        
        if ($this->request->is(['put', 'patch', 'post'])) {
            $user = $this->Auth->user();
            $data = $this->request->getData();
            $data = $this->_prepareData($data);
            if ($user) {
                $data['modified_by_id'] = $user['id'];
            }
            $user = $this->Users->patchEntity(
                $user, $data, ['associated' => []]
            );
            if (!$this->Users->save($user)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        
        $this->set('user', $user);
        $this->set('_serialize', 'user');
    }
    
    /*
     |--------------------------------------------------------------------
     | Delete
     |--------------------------------------------------------------------
     */
    
    public function delete($id = null)
    {
        $user = $this->Users->get($id);
        
        if ($this->request->is(['delete', 'post'])) {
            if (!$this->Users->delete($user)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        
        $this->set('user', $user);
        $this->set('_serialize', 'user');
    }
    
    /*
     |--------------------------------------------------------------------
     | Import
     |--------------------------------------------------------------------
     */
    
    public function import()
    {
        
    }
    
    /*
     |--------------------------------------------------------------------
     | Export
     |--------------------------------------------------------------------
     */
    
    public function export()
    {
        
    }
    
    /*
     |--------------------------------------------------------------------
     | Login
     |--------------------------------------------------------------------
     */
    
    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                $this->set('success', true);
                $this->set('redirect', $this->Auth->redirectUrl());
                $this->set('_serialize', ['success', 'redirect']);
                return;
            }
            $this->set('success', false);
            $this->set('error', 'Username or password did not match');
            $this->set('_serialize', ['success', 'error']);
        }
    }
    
    /*
     |--------------------------------------------------------------------
     | Logout
     |--------------------------------------------------------------------
     */
    
    public function logout()
    {
        return $this->redirect($this->Auth->logout());
    }
    
    /*
     |--------------------------------------------------------------------
     | Forgot password
     |--------------------------------------------------------------------
     */
    
    public function forgotPassword()
    {
        $email = $this->request->query('email');
        if ($email) {
            $user = $this->Users->find()->where(['username' => $email])->first();
            if (!$user) {
                $this->set('success', false);
                $this->set('error', 'The email address is not associated with an account');
                $this->set('_serialize', ['success', 'error']);
                return;
            } else {
                if (!($user->token && $user->token_type == 'password-reset')) {
                    $user->token = Text::uuid();
                    $user->token_type = 'password-reset';
                    $this->Users->save($user);
                }
                $this->_sendPasswordResetEmail($user);
                $this->set('success', true);
                $this->set('_serialize', ['success']);
            }
        }
    }
    
    /*
     |--------------------------------------------------------------------
     | Send password reset email
     |--------------------------------------------------------------------
     */
    
    private function _sendPasswordResetEmail($user)
    {
        
    }
    
    /*
     |--------------------------------------------------------------------
     | Verfiy email sent
     |--------------------------------------------------------------------
     */
    
    public function verifyEmailSent($token)
    {
        $user = $this->Users->find()->where(['token' => $token])->first();
        $this->set('user', $user);
    }
    
    /*
     |--------------------------------------------------------------------
     | Verfiy email resend
     |--------------------------------------------------------------------
     */
    
    public function verifyEmailResend($token)
    {
        $user = $this->Users->find()->where(['token' => $token])->first();
        if ($user->active) {
            return;
        }
        $this->Users->registrationEmail($user);
        $this->set('user', $user);
    }
    
    /*
     |--------------------------------------------------------------------
     | Verfiy email
     |--------------------------------------------------------------------
     */
    
    public function verifyEmail($token)
    {
        $user = $this->Users->find()->where(['token' => $token])->first();
        $user->active = 1;
        $user->token = null;
        $user->token_type = null;
        $this->Users->save($user);
        $this->set('user', $user);
    }
    
    /*
     |--------------------------------------------------------------------
     | Registration success
     |--------------------------------------------------------------------
     */
    
    public function registrationSuccess()
    {
        
    }
    
    /*
     |--------------------------------------------------------------------
     | Reset password
     |--------------------------------------------------------------------
     */
    
    public function resetPassword()
    {
        
    }
    
    /*
     |--------------------------------------------------------------------
     | Update password
     |--------------------------------------------------------------------
     */
    
    public function updatePassword($token = null)
    {
        if (!$token) {
            return $this->redirect('/');
        }
        $query = $this->Users->find()->where(['token' => $token]);
        $user = $query->first();
        if (!$user) {
            return $this->redirect('/');
        }
        $this->set('user');
    }
    
    /*
     |--------------------------------------------------------------------
     | Update password
     |--------------------------------------------------------------------
     */
    
    public function activate () {
        if ($this->request->is('post')) {
            $error = null;
            $id = $this->request->data('id');
            $user = $this->Users->get($id);
            $password = $this->request->data('password');
            $password2 = $this->request->data('password2');
            if (!$password) $error = 'No password provided';
            if (!$error && !$password2) $error = 'Please confirm password';
            if (!$error && ($password !== $password2)) $error = 'The passwords do not match';
            if (!$error) {
                $user->password = (new DefaultPasswordHasher)->hash($password);
                $user->active = true;
                $user->token = null;
                $user->token_type = null;
                $this->Users->save($user);
                return $this->redirect('/');
            } else {
                $this->set('error', $error);
            }
        } else {
            $token = $this->request->query('token');
            $query = $this->Users->find()->where(['token' => $token]);
            if ($query->count() > 0) {
                $user = $query->first();
            } else {
                die('The specified token was not identified');
            }
        }
        $this->set('user', $user);
    }
    
    /*
     |--------------------------------------------------------------------------
     | Before filter
     |--------------------------------------------------------------------------
     */
    
    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        $this->Auth->deny();
        $this->Auth->allow([
            'login',
            'create',
            'verifyEmailSent',
            'verifyEmailResend',
            'forgotPassword',
            'verifyEmail',
            'registrationSuccess',
            'resetPassword',
            'resetPasswordSuccess',
            'updatePassword'
        ]);
    }
    
    /*
     |--------------------------------------------------------------------------
     | Is authorized
     |--------------------------------------------------------------------------
     */
    
    public function isAuthorized($user = null)
    {
        return true;
    }
    
    /*
     |--------------------------------------------------------------------
     | Prepare data
     |--------------------------------------------------------------------
     */
    
    protected function _prepareData($data)
    {
        unset($data['created']);
        unset($data['modified']);
        return $data;
    }
}
