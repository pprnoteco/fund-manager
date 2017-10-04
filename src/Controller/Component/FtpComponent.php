<?php
/*
|------------------------------------------------------------------------------
| Controller\Component: FTP
|------------------------------------------------------------------------------
*/

namespace App\Controller\Component;

use Cake\Controller\Component;

class FtpComponent extends Component
{
    public $handle = null;
    
    /*
    |--------------------------------------------------------------------------
    | Connect
    |--------------------------------------------------------------------------
    */
    
    public function connect($host, $port = 21, $timeout = 90)
    {
        $handle = ftp_connect($host, $port, $timeout);
        $this->handle = $handle;
        return $this;
    }
    
    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    */
    
    public function login($username = null, $password = null)
    {
        ftp_login($this->handle, $username, $password);
        return $this;
    }
    
    /*
    |--------------------------------------------------------------------------
    | Close
    |--------------------------------------------------------------------------
    */
    
    public function close()
    {
        ftp_close($this->handle);
        $this->handle = null;
        return $this;
    }
    
    /*
    |--------------------------------------------------------------------------
    | Size
    |--------------------------------------------------------------------------
    */
    
    public function size($remote_file)
    {
        return ftp_size($this->handle, $remote_file);
    }
    
    /*
    |--------------------------------------------------------------------------
    | Exists
    |--------------------------------------------------------------------------
    */
    
    public function exists($remote_file) {
        return $this->size($remote_file) !== -1;
    }
    
    /*
    |--------------------------------------------------------------------------
    | Pasv
    |--------------------------------------------------------------------------
    */
    
    public function pasv($pasv) {
        ftp_pasv($this->handle, $pasv);
        return $this;
    }
    
    /*
    |--------------------------------------------------------------------------
    | Nlist
    |--------------------------------------------------------------------------
    */
    
    public function nlist($directory = null)
    {
        return ftp_nlist($this->handle, $directory);
    }
    
    /*
    |--------------------------------------------------------------------------
    | Raw list
    |--------------------------------------------------------------------------
    */
    
    public function rawlist($directory = null, $recursive = false)
    {
        return ftp_rawlist($this->handle, $directory, $recursive);
    }
    
    public function raw ($cmd) {
        return ftp_raw($this->handle, $cmd);
    }
    
    
    
    
    
    public function upload($local_file, $remote_file = null, $mode = FTP_BINARY, $startpos = 0)
    {
        $remote_file = $remote_file ? $remote_file : basename($local_file);
        return ftp_put($this->_stream, $remote_file, $local_file, $mode, $startpos);
    }
    
    public function downlaod($remote_file, $local_file = null, $mode = FTP_BINARY, $resumepos = 0)
    {
        return ftp_put($this->_stream, $local_file, $remote_file, $mode, $startpos);
    }
    
    public function rename($oldname, $newname)
    {
        return ftp_rename($this->_stream, $oldname, $newname);
    }
    
    public function delete($path)
    {
        return ftp_delete($this->_stream, $path);
    }
}
