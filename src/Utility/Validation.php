<?php
/*
 |-----------------------------------------------------------------------------
 | Utility: Validation
 |-----------------------------------------------------------------------------
 */

namespace App\Utility;

class Validation
{
    /*
     |-------------------------------------------------------------------------
     | Get first error
     |-------------------------------------------------------------------------
     */
    
    public static function getFirstError($entity, $order = null, $default = 'An unexpected error occured')
    {
        $message = null;
        if (!$order) {
            $errors = $entity->getErrors();
            foreach ($errors as $field => $fieldErrors) {
                if ($message) break;
                foreach ($fieldErrors as $errorType => $error) {
                    $message = $error;
                    break;
                }
            }
        } else {
            foreach ($order as $field) {
                $fieldErrors = $entity->getError($field);
                if (!$fieldErrors) continue;
                if ($message) break;
                foreach ($fieldErrors as $errorType => $error) {
                    $message = $error;
                    break;
                }
            }
        }
        return $message ? $message : $default;
    }
}
