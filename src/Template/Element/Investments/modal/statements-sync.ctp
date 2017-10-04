<?php
$slug = isset($slug) ? $slug : 'investments-statements';
$id = $slug . '-sync-modal';
?>

<!-- Investments statements sync
------------------------------------------------------------------------------>
<div class="modal fade" 
     id="<?= $id ?>" 
     tabindex="-1" 
     role="dialog" 
     aria-labelledby="<?= $id ?>-label" 
     aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            
            <!-- Header
            ------------------------------------------------------------------>
            <div class="modal-header">
                <h5 class="modal-title" id="<?= $id ?>-label">
                    <span class="fa fa-refresh"></span>
                    Statements
                    <small class="text-muted">Sync</small>
                </h5>
                <button type="button" class="close" data-action="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
            <!-- Body
            ------------------------------------------------------------------>
            <div class="modal-body">
                
                <div class="alert alert-success">
                    <span class="fa fa-check fa-fw"></span>
                    All statements are up to date.
                </div>
                
            </div>
            
            <!-- Footer
            ------------------------------------------------------------------>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-action="close">
                    <span class="fa fa-ban"></span>&nbsp;
                    Close
                </button>
            </div>
            
        </div>
    </div>
</div>