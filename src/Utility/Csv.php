<?php
/*
 |------------------------------------------------------------------------
 | Controller: Offerings controller
 |------------------------------------------------------------------------
 */

namespace App\Utility;

class Csv
{
    public static function line($arr)
    {
        ob_start();
        $fp = fopen('php://output', 'w');
        fputcsv($fp, $arr);
        fclose($fp);
        return ob_get_clean();
    }
}
