<?php
$slug = isset($slug) ? $slug : 'apply-transactions';
$id = $slug . '-submit-modal';
?>

<!-- Apply transactions submit modal
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
                    <span class="fa fa-check"></span>
                    Transactions
                    <small class="text-muted">Submit</small>
                </h5>
                <button type="button" class="close" data-action="cancel" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
            <!-- Body
            ------------------------------------------------------------------>
            <div class="modal-body">
                
                <p>
                    By clicking submit, <em><span data-field="total-count">0</span></em> transactions will be created and applied as described below. Please verify that this information is correct as this action cannot easily be undone. Upon completion, a CSV file will download reflecting any new transactions.
                </p>
                
                <table class="table table-bordered" id="apply-transactions-submit-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th class="text-center">Count</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Preferred payment (prorated)</td>
                            <td data-field="1-count" class="text-center"></td>
                            <td data-field="1-amount"></td>
                        </tr>
                        <tr>
                            <td>Preferred payment</td>
                            <td data-field="2-count" class="text-center"></td>
                            <td data-field="2-amount"></td>
                        </tr>
                        <tr>
                            <td>Drawdown</td>
                            <td data-field="3-count" class="text-center"></td>
                            <td data-field="3-amount"></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Total</th>
                            <th data-field="total-count" class="text-center"></th>
                            <th data-field="total-amount"></th>
                        </tr>
                    </tfoot>
                </table>
                
                <small class="form-text text-muted">
                    This action may take a few minutes, please do not close your browser or disconnect from the internet until this action has completed.
                </small>
                
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
                    <span class="fa fa-upload"></span>&nbsp;
                    Submit
                </button>
            </div>
            
        </div>
    </div>
</div>