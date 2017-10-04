<?php
/*
 |------------------------------------------------------------------------
 | Model\Entity: Entity
 |------------------------------------------------------------------------
 */

namespace App\Model\Entity;

use Cake\Chronos\Chronos;
use Cake\ORM\Entity as CakeEntity;

class Entity extends CakeEntity
{
    /*
     |--------------------------------------------------------------------
     | Changed
     |--------------------------------------------------------------------
     */
    
    public function changed($fields)
    {
        $fields = is_array($fields) ? $fields : [$fields];
        foreach ($fields as $field) {
            if ($this->get($field) !== $this->getOriginal($field)) {
                return true;
            }
        }
        return false;
    }
    
    /*
     |--------------------------------------------------------------------
     | Set Created
     |--------------------------------------------------------------------
     */
    
    protected function _setCreated($date)
    {
        if (is_string($date)) {
            return new \DateTime($date);
        }
        return $date;
    }
    
    /*
     |--------------------------------------------------------------------
     | Set Modified
     |--------------------------------------------------------------------
     */
    
    protected function _setModified($date)
    {
        if (is_string($date)) {
            return new \DateTime($date);
        }
        return $date;
    }
}
