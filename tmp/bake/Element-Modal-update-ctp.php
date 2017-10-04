<!-- Template\Element\<?= $modelClass ?>\Modal: Update
-------------------------------------------------------------------------->

<CakePHPBakeOpenTagphp
$slug = isset($slug) ? $slug : '<?= $slug ?>';
CakePHPBakeCloseTag>

<div class="modal fade" 
     id="<CakePHPBakeOpenTag= $slug CakePHPBakeCloseTag>-update-modal" 
     tabindex="-1" 
     role="dialog" 
     aria-labelledby="<CakePHPBakeOpenTag= $slug CakePHPBakeCloseTag>-update-modal-label" 
     aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            
            <!-- Header
            ------------------------------------------------------------->
            
            <div class="modal-header">
                <h5 class="modal-title" id="<CakePHPBakeOpenTag= $slug CakePHPBakeCloseTag>-update-modal-label">
                    <span class="fa fa-pencil-square-o"></span>
                    <?= $pluralHumanName . "\n" ?>
                    <small class="text-muted">Update</small>
                </h5>
                <button type="button" class="close" data-action="cancel" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
            <!-- Body
            ------------------------------------------------------------->
            
            <div class="modal-body">
                <CakePHPBakeOpenTag= $this->element('<?= $pluralVar ?>/form/update') CakePHPBakeCloseTag>
                <div class="text-danger" id="<CakePHPBakeOpenTag= $slug CakePHPBakeCloseTag>-update-modal-alert"></div>
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