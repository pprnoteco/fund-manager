<!-- Template\Element\Transactions\Modal: Delete
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'transactions';
?>

<div class="modal fade" 
     id="<?= $slug ?>-delete-modal" 
     tabindex="-1" 
     role="dialog" 
     aria-labelledby="<?= $slug ?>-delete-modal-label" 
     aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            
            <!-- Header
            ------------------------------------------------------------->
            
            <div class="modal-header">
                <h5 class="modal-title" id="<?= $slug ?>-delete-modal-label">
                    <span class="fa fa-trash"></span>
                    Transactions
                    <small class="text-muted">Delete</small>
                </h5>
                <button type="button" class="close" data-action="cancel" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
            <!-- Body
            ------------------------------------------------------------->
            
            <div class="modal-body">
                <?= $this->element('transactions/profile/delete', [ 'slug' => $slug ]) ?>
                <div class="text-danger" id="<?= $slug ?>-delete-modal-alert"></div>
            </div>
            
            <!-- Footer
            ------------------------------------------------------------->
            
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-action="cancel">
                    <span class="fa fa-ban"></span>&nbsp;
                    Cancel
                </button>
                <button type="button" class="btn btn-danger" data-action="submit">
                    <span class="fa fa-trash"></span>&nbsp;
                    Delete
                </button>
            </div>
            
        </div>
    </div>
</div>