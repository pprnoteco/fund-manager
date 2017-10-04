<?php
/*
 |-----------------------------------------------------------------------------
 | Controller: Admin controller
 |-----------------------------------------------------------------------------
 */
namespace App\Controller;

use App\Controller\AppController;

class FtpController extends AppController
{
    /*
     |-------------------------------------------------------------------------
     | Exists
     |-------------------------------------------------------------------------
     */
    
    public function exists()
    {
        $files = $this->request->data('files');
        $this->loadComponent('Ftp');
        $this->Ftp->connect('pprnoteco.com');
        $this->Ftp->login('statements', 'uP-jAd-nEb-naj-hoY');
        $response = [];
        foreach ($files as $file) {
            $file['exists'] = $this->Ftp->exists($file['path']);
            $response[] = $file;
        }
        $this->Ftp->close();
        $json = json_encode($response);
        $stream = $this->Stream->fromString($json, 'application/json');
        $response = $this->response;
        $response = $response->withType('json');
        $response = $response->withBody($stream);
        return $response;
    }
    
    /*
     |-------------------------------------------------------------------------
     | Is authorized
     |-------------------------------------------------------------------------
     */
    
    public function isAuthorized($user = null)
    {
        return true;
    }
}
