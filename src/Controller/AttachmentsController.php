<?php
/*
 |------------------------------------------------------------------------
 | Controller: Attachments controller
 |------------------------------------------------------------------------
 */

namespace App\Controller;

use Cake\Event\Event;
use Cake\Utility\Text;

class AttachmentsController extends AppController
{
    /*
     |--------------------------------------------------------------------
     | Index
     |--------------------------------------------------------------------
     */
    
    public function index()
    {
        $table = $this->Attachments;
        $contain = [];
        $entities = $table->find()->contain($contain);
        $this->set('attachments', $entities);
        $this->set('_serialize', 'attachments');
    }
    
    /*
     |--------------------------------------------------------------------
     | Create
     |--------------------------------------------------------------------
     */
    
    public function create()
    {
        $attachment = $this->Attachments->newEntity();
        
        if ($this->request->is('post')) {
            
            // Assure file was uploaded
            if (!array_key_exists('file', $_FILES)) {
                $this->set('error', 'No attachment provided');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
            
            $uuid = Text::uuid();
            $file = $_FILES['file'];
            
            // Validate file upload
            if ($file['error'] !== UPLOAD_ERR_OK) {
                switch ($file['error']) {
                    case UPLOAD_ERR_INI_SIZE:
                        $this->set('error', 'The selected file is too big');
                        break;
                    case UPLOAD_ERR_FORM_SIZE:
                        $this->set('error', 'The selected file is too big');
                        break;
                    case UPLOAD_ERR_NO_FILE:
                        $this->set('error', 'No attachment provided');
                        break;
                    default:
                        $this->set('error', 'An unexpected error occured');
                }
                $this->set('_serialize', [ 'error' ]);
                return;
            }
            
            // Move uploaded file
            if (!move_uploaded_file($file["tmp_name"], UPLOADS . $uuid)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
            
            $data = $this->request->getData();
            
            $data['path'] = $uuid;
            $data['name'] = $file['name'];
            $data['mime'] = $file['type'];
            $data['size'] = $file['size'];
            $attachment = $this->Attachments->patchEntity($attachment, $data);
            if (!$this->Attachments->save($attachment)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        
        $this->set('attachment', $attachment);
        $this->set('_serialize', 'attachment');
    }
    
    /*
     |--------------------------------------------------------------------
     | Read
     |--------------------------------------------------------------------
     */
    
    public function read($id = null)
    {
        $table = $this->Attachments;
        $entity = $table->get($id, [
            'contain' => [
                'Comments',
                'Comments.CreatedBy',
                'Attachments',
                'Attachments.CreatedBy',
            ]
        ]);
        $this->set('attachment', $entity);
        $this->set('_serialize', 'attachment');
    }
    
    /*
     |--------------------------------------------------------------------
     | Update
     |--------------------------------------------------------------------
     */
    
    public function update($id = null)
    {
        $attachment = $this->Attachments->get($id);
        
        if ($this->request->is(['put', 'patch', 'post'])) {
            $data = $this->request->getData();
            $attachment = $this->Attachments->patchEntity(
                $attachment, $data, ['associated' => []]
            );
            if (!$this->Attachments->save($attachment)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        
        $this->set('attachment', $attachment);
        $this->set('_serialize', 'attachment');
    }
    
    /*
     |--------------------------------------------------------------------
     | Delete
     |--------------------------------------------------------------------
     */
    
    public function delete($id = null)
    {
        $attachment = $this->Attachments->get($id);
        
        if (!@unlink(UPLOADS . $attachment->path)) {
            $this->set('error', 'An unexpected error occured');
            $this->set('_serialize', [ 'error' ]);
            return;
        }
        
        if ($this->request->is(['delete', 'post'])) {
            if (!$this->Attachments->delete($attachment)) {
                $this->set('error', 'An unexpected error occured');
                $this->set('_serialize', [ 'error' ]);
                return;
            }
        }
        
        $this->set('attachment', $attachment);
        $this->set('_serialize', 'attachment');
    }
    
    public function download($id = null)
    {
        $attachment = $this->Attachments->get($id);
        $file = UPLOADS . $attachment->path;
        $filename = $attachment->name;
        
        if (file_exists($file)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="'.$filename.'"');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($file));
            readfile($file);
            exit;
        }
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
     |--------------------------------------------------------------------------
     | Before filter
     |--------------------------------------------------------------------------
     */
    
    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        $this->Auth->deny();
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
}
