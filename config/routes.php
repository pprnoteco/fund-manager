<?php
/*
 |-----------------------------------------------------------------------------
 | Config: Routes
 |-----------------------------------------------------------------------------
 */

use Cake\Core\Plugin;
use Cake\Routing\RouteBuilder;
use Cake\Routing\Router;
use Cake\Routing\Route\DashedRoute;

Router::defaultRouteClass(DashedRoute::class);

Router::scope('/', function (RouteBuilder $routes) {
    
    $routes->extensions(['json']);
    
    $routes->connect('/', ['controller' => 'Reports', 'action' => 'index']);
    $routes->connect('/pages/*', ['controller' => 'Pages', 'action' => 'display']);
    
    $routes->connect('/activate', ['controller' => 'Users', 'action' => 'activate']);
    
    $routes->connect('/login', ['controller' => 'Users', 'action' => 'login']);
    $routes->connect('/logout', ['controller' => 'Users', 'action' => 'logout']);
    $routes->connect('/profile', ['controller' => 'Users', 'action' => 'read']);
    $routes->connect('/register', ['controller' => 'Users', 'action' => 'create']);
    $routes->connect('/verify-email/:token', ['controller' => 'Users', 'action' => 'verifyEmail'], ['pass' => ['token']]);
    $routes->connect('/verify-email-sent/:token', ['controller' => 'Users', 'action' => 'verifyEmailSent'], ['pass' => ['token']]);
    $routes->connect('/verify-email-resend/:token', ['controller' => 'Users', 'action' => 'verifyEmailResend'], ['pass' => ['token']]);
    
    $routes->connect('/forgot-password', ['controller' => 'Users', 'action' => 'forgotPassword']);
    
    $routes->connect('/reset-password', ['controller' => 'Users', 'action' => 'resetPassword']);
    $routes->connect('/update-password/:token', ['controller' => 'Users', 'action' => 'updatePassword'], ['pass' => ['token']]);
    $routes->connect('/verify-email', ['controller' => 'Users', 'action' => 'verifyEmail']);
    $routes->connect('/registration-success', ['controller' => 'Users', 'action' => 'registrationSuccess']);
    
    $routes->connect('/:controller/:id',
        ['action' => 'read'],
        ['id' => '[0-9]+', 'pass' => ['id']]
    );
    
    $routes->fallbacks(DashedRoute::class);
    
});

Plugin::routes();
