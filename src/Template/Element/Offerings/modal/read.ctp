<!-- Template\Element\Offerings\Modal: Read
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'offerings';
?>

<div class="modal fade" 
     id="<?= $slug ?>-read-modal" 
     tabindex="-1" 
     role="dialog" 
     aria-labelledby="<?= $slug ?>-read-modal-label" 
     aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            
            <!-- Header
            ------------------------------------------------------------->
            <div class="modal-header">
                <h5 class="modal-title" id="<?= $slug ?>-read-modal-label">
                    <span class="fa fa-eye"></span>
                    Offerings
                    <small class="text-muted">Profile</small>
                </h5>
                <button type="button" class="close" data-action="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
            <!-- Body
            ------------------------------------------------------------->
            <div class="modal-body">
                
                <!-- Profile
                --------------------------------------------------------->
                <?= $this->element('Offerings/profile/read') ?>
                
                <!-- Tabs
                --------------------------------------------------------->
                <ul class="nav nav-tabs" id="offerings-tab" role="tablist">
                    
                    <!-- Investments
                    ----------------------------------------------------->
                    <li class="nav-item">
                        <a class="nav-link active" 
                           id="offerings-investments-tab" 
                           data-toggle="tab" 
                           href="#offerings-investments-panel" 
                           role="tab" 
                           aria-controls="offerings-investments-panel" 
                           aria-expanded="true">
                            <span class="fa fa-dollar fa-fw"></span>
                            Investments
                        </a>
                    </li>
                    
                    <!-- Comments tab
                    ----------------------------------------------------->
                    <li class="nav-item">
                        <a class="nav-link" 
                           id="offerings-comments-tab" 
                           data-toggle="tab" 
                           href="#offerings-comments-panel" 
                           role="tab" 
                           aria-controls="offerings-comments-panel">
                            <span class="fa fa-comment fa-fw"></span>
                            Comments
                        </a>
                    </li>

                    <!-- Attachments tab
                    ----------------------------------------------------->
                    <li class="nav-item">
                        <a class="nav-link" 
                           id="offerings-attachments-tab" 
                           data-toggle="tab" 
                           href="#offerings-attachments-panel" 
                           role="tab" 
                           aria-controls="offerings-attachments-panel">
                            <span class="fa fa-paperclip fa-fw"></span>
                            Attachments
                        </a>
                    </li>
                    
                </ul>
                
                <!-- Panels
                --------------------------------------------------------->
                <div class="tab-content" id="offerings-tab-content">
                    
                    <!-- Investments Panel
                    --------------------------------------------------------------------->
                    <div class="tab-pane fade show active" 
                         id="offerings-investments-panel" 
                         role="tabpanel" 
                         aria-labelledby="offerings-investments-tab">
                        <?= $this->element('offerings/panel/investments') ?>
                    </div>
                    
                    <!-- Comments Panel
                    --------------------------------------------------------------------->
                    <div class="tab-pane fade" 
                         id="offerings-comments-panel" 
                         role="tabpanel" 
                         aria-labelledby="offerings-comments-tab">
                        <?= $this->element('offerings/panel/comments') ?>
                    </div>

                    <!-- Attachments Panel
                    --------------------------------------------------------------------->
                    <div class="tab-pane fade" 
                         id="offerings-attachments-panel" 
                         role="tabpanel" 
                         aria-labelledby="offerings-attachments-tab">
                        <?= $this->element('offerings/panel/attachments') ?>
                    </div>

                </div>
                
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