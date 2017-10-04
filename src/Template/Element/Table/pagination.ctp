<?php
$hidden = isset($hidden) ? $hidden : false;
?>

<!-- Table pagination
------------------------------------------------------------------------------>
<nav aria-label="Table pagination" 
     id="<?= $slug ?>-table-pagination"
     <?= $hidden ? ' class="d-none"': '' ?>>
    
    <!-- Page information + limit
    -------------------------------------------------------------------------->
    <div class="float-left">
        
        <!-- Page information
        ---------------------------------------------------------------------->
        <span style="margin-right: 15px;">
            <span>Showing page</span>
            <span data-label="page-num">1</span>
            <span>of</span>
            <span data-label="page-max">1</span>
        </span>
        
        <!-- Page limit
        ---------------------------------------------------------------------->
        <select data-action="limit">
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
        </select>
        <span>records per page</span>
        
    </div>
    
    <!-- Page navigation
    -------------------------------------------------------------------------->
    <ul class="pagination justify-content-end">
        
        <!-- First page
        ---------------------------------------------------------------------->
        <li class="page-item disabled">
            <a class="page-link" 
               href="#" 
               tabindex="-1"
               data-action="first">
                <span class="fa fa-angle-double-left"></span>
            </a>
        </li>
        
        <!-- Previous page
        ---------------------------------------------------------------------->
        <li class="page-item disabled">
            <a class="page-link" 
               href="#" 
               tabindex="-1"
               data-action="prev">
                <span class="fa fa-angle-left"></span>
            </a>
        </li>
        
        <!-- Next page
        ---------------------------------------------------------------------->
        <li class="page-item">
            <a class="page-link" 
               href="#" 
               tabindex="-1"
               data-action="next">
                <span class="fa fa-angle-right"></span>
            </a>
        </li>
        
        <!-- Last page
        ---------------------------------------------------------------------->
        <li class="page-item">
            <a class="page-link" 
               href="#" 
               tabindex="-1"
               data-action="last">
                <span class="fa fa-angle-double-right"></span>
            </a>
        </li>
        
    </ul>
</nav>
