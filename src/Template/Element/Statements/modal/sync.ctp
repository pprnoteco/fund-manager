<!-- Template\Element\Statements\Modal: Sync
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'statements';
?>

<div class="modal fade" 
     id="<?= $slug ?>-sync-modal" 
     tabindex="-1" 
     role="dialog" 
     aria-labelledby="<?= $slug ?>-sync-modal-label" 
     aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            
            <!-- Header
            ------------------------------------------------------------->
            
            <div class="modal-header">
                <h5 class="modal-title" id="<?= $slug ?>-sync-modal-label">
                    <span class="fa fa-refresh"></span>
                    Statements
                    <small class="text-muted">Sync</small>
                </h5>
                <button type="button" class="close" data-action="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
            <!-- Body
            ------------------------------------------------------------->
            
            <div class="modal-body">
                
            </div>
            
            <!-- Footer
            ------------------------------------------------------------->
            
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-action="close">
                    <span class="fa fa-ban"></span>&nbsp;
                    Close
                </button>
            </div>
            
        </div>
    </div>
</div>