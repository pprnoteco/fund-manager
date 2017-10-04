<!-- Template\Element\Accounts\Modal: Read
-------------------------------------------------------------------------->

<?php
$slug = isset($slug) ? $slug : 'accounts';
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
                    Accounts
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
                <?= $this->element('Accounts/profile/read') ?>
                
                <!-- Tabs
                --------------------------------------------------------->
                <ul class="nav nav-tabs" id="accounts-tab" role="tablist">
                    
                    <!-- Investments
                    ----------------------------------------------------->
                    <li class="nav-item">
                        <a class="nav-link active" 
                           id="accounts-investments-tab" 
                           data-toggle="tab" 
                           href="#accounts-investments-panel" 
                           role="tab" 
                           aria-controls="accounts-investments-panel" 
                           aria-expanded="true">
                            <span class="fa fa-dollar fa-fw"></span>
                            Investments
                        </a>
                    </li>
                    
                    <!-- Comments tab
                    ----------------------------------------------------->
                    <li class="nav-item">
                        <a class="nav-link" 
                           id="accounts-comments-tab" 
                           data-toggle="tab" 
                           href="#accounts-comments-panel" 
                           role="tab" 
                           aria-controls="accounts-comments-panel">
                            <span class="fa fa-comment fa-fw"></span>
                            Comments
                        </a>
                    </li>

                    <!-- Attachments tab
                    ----------------------------------------------------->
                    <li class="nav-item">
                        <a class="nav-link" 
                           id="accounts-attachments-tab" 
                           data-toggle="tab" 
                           href="#accounts-attachments-panel" 
                           role="tab" 
                           aria-controls="accounts-attachments-panel">
                            <span class="fa fa-paperclip fa-fw"></span>
                            Attachments
                        </a>
                    </li>
                    
                </ul>
                
                <!-- Panels
                --------------------------------------------------------->
                <div class="tab-content" id="accounts-tab-content">
                    
                    <!-- Investments Panel
                    --------------------------------------------------------------------->
                    <div class="tab-pane fade show active" 
                         id="accounts-investments-panel" 
                         role="tabpanel" 
                         aria-labelledby="accounts-investments-tab">
                        <?= $this->element('accounts/panel/investments') ?>
                    </div>
                    
                    <!-- Comments Panel
                    --------------------------------------------------------------------->
                    <div class="tab-pane fade" 
                         id="accounts-comments-panel" 
                         role="tabpanel" 
                         aria-labelledby="accounts-comments-tab">
                        <?= $this->element('accounts/panel/comments') ?>
                    </div>

                    <!-- Attachments Panel
                    --------------------------------------------------------------------->
                    <div class="tab-pane fade" 
                         id="accounts-attachments-panel" 
                         role="tabpanel" 
                         aria-labelledby="accounts-attachments-tab">
                        <?= $this->element('accounts/panel/attachments') ?>
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