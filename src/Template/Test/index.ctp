<div class="row">
    <div class="col-sm-3"></div>
    <div class="col-sm-6">
        
        <hr />
        
        <button class="btn btn-primary"
                data-toggle="modal"
                data-target="#apply-transactions-submit-modal">
            Open
        </button>
        
        <?= $this->element('investments/modal/apply-transactions-submit') ?>
        
    </div>
    <div class="col-sm-3"></div>
</div>

<?php $this->start('script') ?>
<script>

    
</script>
<?php $this->end() ?>