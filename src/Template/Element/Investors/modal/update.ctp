<!-- Template\Element\Investors\Modal: Update
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'investors';
?>

<div class="modal fade" 
     id="<?= $slug ?>-update-modal" 
     tabindex="-1" 
     role="dialog" 
     aria-labelledby="<?= $slug ?>-update-modal-label" 
     aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            
            <!-- Header
            ------------------------------------------------------------->
            
            <div class="modal-header">
                <h5 class="modal-title" id="<?= $slug ?>-update-modal-label">
                    <span class="fa fa-pencil-square-o"></span>
                    Investors
                    <small class="text-muted">Update</small>
                </h5>
                <button type="button" class="close" data-action="cancel" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
            <!-- Body
            ------------------------------------------------------------->
            
            <div class="modal-body">
                <?= $this->element('investors/form/update', [ 'slug' => $slug ]) ?>
                <div class="text-danger" id="<?= $slug ?>-update-modal-alert"></div>
            </div>
            
            <!-- Footer
            ------------------------------------------------------------->
            
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-action="cancel">
                    <span class="fa fa-ban"></span>&nbsp;
                    Cancel
                </button>
                <button type="button" class="btn btn-primary" data-action="submit">
                    <span class="fa fa-floppy-o"></span>&nbsp;
                    Save
                </button>
            </div>
            
        </div>
    </div>
</div>