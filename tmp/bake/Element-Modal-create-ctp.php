<!-- c
-------------------------------------------------------------------------->

<CakePHPBakeOpenTagphp
$slug = isset($slug) ? $slug : '<?= $slug ?>';
CakePHPBakeCloseTag>

<div class="modal fade" 
     id="<CakePHPBakeOpenTag= $slug CakePHPBakeCloseTag>-create-modal" 
     tabindex="-1" 
     role="dialog" 
     aria-labelledby="<CakePHPBakeOpenTag= $slug CakePHPBakeCloseTag>-create-modal-label" 
     aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            
            <!-- Header
            ------------------------------------------------------------->
            
            <div class="modal-header">
                <h5 class="modal-title" id="<CakePHPBakeOpenTag= $slug CakePHPBakeCloseTag>-create-modal-label">
                    <span class="fa fa-plus"></span>
                    <?= $pluralHumanName . "\n" ?>
                    <small class="text-muted">Create</small>
                </h5>
                <button type="button" class="close" data-action="cancel" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
            <!-- Body
            ------------------------------------------------------------->
            
            <div class="modal-body">
                <CakePHPBakeOpenTag= $this->element('<?= $pluralVar ?>/form/create') CakePHPBakeCloseTag>
                <div class="text-danger" id="<CakePHPBakeOpenTag= $slug CakePHPBakeCloseTag>-create-modal-alert"></div>
            </div>
            
            <!-- Footer
            ------------------------------------------------------------->
            
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