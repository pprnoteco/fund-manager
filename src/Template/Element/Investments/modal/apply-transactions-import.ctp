<?php
$slug = isset($slug) ? $slug : 'apply-transactions';
$id = $slug . '-import-modal';
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
                    <span class="fa fa-upload"></span>
                    Transactions
                    <small class="text-muted">Import from CSV</small>
                </h5>
                <button type="button" class="close" data-action="cancel" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
            <!-- Body
            ------------------------------------------------------------------>
            <div class="modal-body">
                
                <h5>Import template</h5>
                <hr />
                
                <table class="table table-sm table-bordered">
                    <thead>
                        <tr>
                            <th>Column</th>
                            <th>Description</th>
                            <th class="text-center">Required</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>investment_id</td>
                            <td>The system id for the investment</td>
                            <td class="text-center">
                                <span class="fa fa-check text-success"></span>
                            </td>
                        </tr>
                        <tr>
                            <td>date</td>
                            <td>The date of the transaction</td>
                            <td class="text-center">
                                <span class="fa fa-check text-success"></span>
                            </td>
                        </tr>
                        <tr>
                            <td>amount</td>
                            <td>
                                The amount of the transaction<br />
                                Must be greater than 0, and less than the balace (if drawdown)<br />
                            </td>
                            <td class="text-center">
                                <span class="fa fa-check text-success"></span>
                            </td>
                        </tr>
                        <tr>
                            <td>type</td>
                            <td>
                                The type of transaction:<br/>
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th class="text-center">Value</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th class="text-center">0</th>
                                            <td>Initial deposit</td>
                                        </tr>
                                        <tr>
                                            <th class="text-center">1</th>
                                            <td>Preferred payment (prorated)</td>
                                        </tr>
                                        <tr>
                                            <th class="text-center">2</th>
                                            <td>Preferred payment</td>
                                        </tr>
                                        <tr>
                                            <th class="text-center">3</th>
                                            <td>Drawdown</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td class="text-center">
                                <span class="fa fa-check text-success"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <p class="text-muted">
                    The order of the columns does not matter, additional columns may be present in the file but will be ignored.
                </p>
                
                <hr />
                
                <?= $this->element('investments/form/apply-transactions-import') ?>
                
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
                    Import
                </button>
            </div>
            
        </div>
    </div>
</div>