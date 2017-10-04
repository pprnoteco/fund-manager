<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Mailer\Email;

class TestController extends AppController
{
    public function index()
    {
        $email = new Email('default');
        $email
            ->set('token', 'abc')
            ->template('register', 'default')
            ->emailFormat('html')
            ->to('jtrumbull@pprnoteco.com')
            ->subject('Your Fund Manager Account Is Ready')
            ->send();
        
        die('SENT');
    }
}