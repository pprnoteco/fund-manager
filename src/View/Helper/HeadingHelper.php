<?php
/*
 |------------------------------------------------------------------------
 | View\Helper: Heading
 |------------------------------------------------------------------------
 */

namespace App\View\Helper;

use Cake\View\Helper;

class HeadingHelper extends Helper
{
    protected $_icon = null;
    
    protected $_title = null;
    
    protected $_subtitle = null;
    
    /*
     |--------------------------------------------------------------------
     | Icon
     |--------------------------------------------------------------------
     */
    
    public function icon($icon = null)
    {
        $this->_icon = $icon;
    }
    
    /*
     |--------------------------------------------------------------------
     | Title
     |--------------------------------------------------------------------
     */
    
    public function title($title = null)
    {
        $this->_title = $title;
    }
    
    /*
     |--------------------------------------------------------------------
     | Subtitle
     |--------------------------------------------------------------------
     */
    
    public function subtitle($subtitle = null)
    {
        $this->_subtitle = $subtitle;
    }
    
    /*
     |--------------------------------------------------------------------
     | Render
     |--------------------------------------------------------------------
     */
    
    public function render()
    {
        $icon = $this->_icon;
        $title = $this->_title;
        $subtitle = $this->_subtitle;
        
        if (!$title) return '';
        
        $html = '<h2 class="page-header">';
        if ($icon) {
            $html .= '<span class="fa fa-' . $icon . '"></span> ';
        }
        $html.= $title;
        if ($subtitle) {
            $html .= ' <small class="text-muted">' . $subtitle . '</small>';
        }
        $html.= '</h2><hr />';
        
        return $html;
    }
}