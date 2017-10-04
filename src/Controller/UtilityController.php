<?php
/*
 |------------------------------------------------------------------------
 | Controller: Utility controller
 |------------------------------------------------------------------------
 */

namespace App\Controller;

use DateTime;
use App\Controller\AppController;
use Cake\Event\Event;

class UtilityController extends AppController
{
    /*
     |--------------------------------------------------------------------
     | Csv to JSON
     |--------------------------------------------------------------------
     */
    
    public function csvToJson()
    {
        $error = false;
        $json = ['success' => false];
        
        // Assure file was uploaded
        if (!array_key_exists('file', $_FILES)) {
            $error = true;
            $json['error'] = 'No file attached';
            return;
        }
        
        $file = $_FILES['file'];
        $mimes = [ 'application/vnd.ms-excel', 'text/csv', 'text/plain' ];
        
        // Validate file upload
        if (!$error && $file['error'] !== UPLOAD_ERR_OK) {
            switch ($file['error']) {
                case UPLOAD_ERR_INI_SIZE:
                    $message = 'The selected file is too big';
                    break;
                case UPLOAD_ERR_FORM_SIZE:
                    $message = 'The selected file is too big';
                    break;
                case UPLOAD_ERR_NO_FILE:
                    $message = 'No attachment provided';
                    break;
                default:
                    $message = 'An unexpected error occured';
            }
            $error = true;
            $json['error'] = $message;
            return;
        }
        
        // Validate mime type
        if (!$error && !in_array($file['type'], $mimes)) {
            $error = true;
            $json['error'] = 'The attachment musch be CSV';
        }
        
        if (!$error) {
            $json['success'] = true;
            $json['data'] = $this->Csv->toArray($file['tmp_name']);
        }
        
        $stream = $this->Stream->fromString(json_encode($json), 'application/json');
        $response = $this->response;
        $response = $response->withType('json');
        $response = $response->withBody($stream);
        return $response;
    }
}
