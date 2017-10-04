<?php
$slug = isset($slug) ? $slug : 'apply-transactions';
$id = $slug . '-add-modal';
?>

<!-- Apply transactions add modal
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
                    <span class="fa fa-plus"></span>
                    Transactions
                    <small class="text-muted">Add</small>
                </h5>
                <button type="button" class="close" data-action="cancel" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
            <!-- Body
            ------------------------------------------------------------------>
            <div class="modal-body">
                <?= $this->element('investments/form/apply-transactions-add') ?>
                <div class="text-danger" id="<?= $id ?>-alert"></div>
            </div>
            
            <!-- Footer
            ------------------------------------------------------------------>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-action="cancel">
                    <span class="fa fa-ban"></span>&nbsp;
                    Cancel
                </button>
                <button type="button" class="btn btn-primary" data-action="submit">
                    <span class="fa fa-plus"></span>&nbsp;
                    Create
                </button>
            </div>
            
        </div>
    </div>
</div>