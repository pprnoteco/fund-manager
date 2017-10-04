<?php
namespace App\Controller\Component;

use Cake\Controller\Component;

class CsvComponent extends Component
{
    public function line($data)
    {
        ob_start();
        $fp = fopen('php://output', 'w');
        fputcsv($fp, $data);
        fclose($fp);
        return ob_get_clean();
    }
    
    public function toArray($file)
    {
        $header = null;
        $handle = fopen($file, 'r');
        $records = [];
        while (($row = fgetcsv($handle)) !== false) {
            if (!$header) {
                $header = $row;
                continue;
            }
            $records[] = array_combine($header, $row);
        }
        return $records;
    }
    
    public function toJson($file)
    {
        return json_encode($this->toArray($file));
    }
}
