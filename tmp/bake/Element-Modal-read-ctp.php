<!-- Template\Element\<?= $modelClass ?>\Modal: Read
-------------------------------------------------------------------------->

<CakePHPBakeOpenTagphp
$slug = isset($slug) ? $slug : '<?= $slug ?>';
CakePHPBakeCloseTag>

<div class="modal fade" 
     id="<CakePHPBakeOpenTag= $slug CakePHPBakeCloseTag>-read-modal" 
     tabindex="-1" 
     role="dialog" 
     aria-labelledby="<CakePHPBakeOpenTag= $slug CakePHPBakeCloseTag>-read-modal-label" 
     aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            
            <!-- Header
            ------------------------------------------------------------->
            
            <div class="modal-header">
                <h5 class="modal-title" id="<CakePHPBakeOpenTag= $slug CakePHPBakeCloseTag>-read-modal-label">
                    <span class="fa fa-eye"></span>
                    <?= $pluralHumanName . "\n" ?>
                    <small class="text-muted">Profile</small>
                </h5>
                <button type="button" class="close" data-action="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
            <!-- Body
            ------------------------------------------------------------->
            
            <div class="modal-body">
                <CakePHPBakeOpenTag= $this->element('<?= $modelClass ?>/profile/read') CakePHPBakeCloseTag>
            </div>
            
            <!-- Footer
            ------------------------------------------------------------->
            
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-action="close">
                    <span class="fa fa-ban"></span>&nbsp;
                    Close
                </button>
                <button type="button" class="btn btn-secondary" data-action="update">
                    <span class="fa fa-pencil-square-o"></span>&nbsp;
                    Update
                </button>
            </div>
            
        </div>
    </div>
</div>