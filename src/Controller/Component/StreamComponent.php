<?php
namespace App\Controller\Component;

use Cake\Controller\Component;
use Zend\Diactoros\Stream;

class StreamComponent extends Component
{
    public function fromString($data, $type = 'text/plain', $base64 = true)
    {
        if ($base64) $data = base64_encode($data);
        $type = $base64 ? $type . ';base64' : $type;
        $data = 'data:' . $type . ',' . $data;
        $handle = fopen($data, 'r');
        $stream = new Stream($handle);
        return $stream;
    }
}
