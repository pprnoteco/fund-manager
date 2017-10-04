<?php
$this->layout = null;
$investors = $investment->account->investors;
$investorArr = [];
foreach ($investors as $investor) {
    $investorArr[] = $investor->name;
}
$investor = implode(', ', $investorArr);
$transactionTypes = [
    'Initial deposit',
    'Preferred payment (prorated)',
    'Preferred payment',
    'Drawdown'
];
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        
        <!-- Meta
        ----------------------------------------------------------------->
        
        <meta charset="utf-8">
        <meta name="description" content="">
        <meta name="author" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <?= $this->fetch('meta') ?>
        
        <title>Fund manager &middot; Statement</title>
        <link rel="icon" type="image/png" href="<?= $this->url('/favicon.png') ?>">

        <!-- CSS
        ----------------------------------------------------------------->
        
        <?= $this->html->css('bootstrap.min.css') . "\n" ?>
        <?= $this->html->css('bootstrap-datepicker.min.css') . "\n" ?>
        <?= $this->html->css('font-awesome.min.css') . "\n" ?>
        <?= $this->html->css('style.css?v1') . "\n" ?>
        
    </head>
    <body>
        
        <header class="container" style="margin-bottom: 50px;">
            <strong><?= $investment->offering->fund->name ?></strong><br />
            3748 W Chester Pike, Suite 103<br />
            Newtown Square, PA 19073
            <hr />
        </header>
        
        <section class="container">
            
            <h2>
                Investment account statement
                <small class="pull-right">September, 2017</small>
            </h2>
            
            <hr />
            
            <!-- Fund information
            ------------------------------------------------------------->
            
            <div class="row">
                
                <!-- Fund information
                --------------------------------------------------------->
                <div class="col-sm-6"><strong>Fund name</strong></div>
                <div class="col-sm-6"><?= $investment->offering->fund->name ?></div>
                <div class="col-sm-12"><hr /></div>
                
                <div class="col-sm-6"><strong>Fund rate</strong></div>
                <div class="col-sm-6"><?= number_format($investment->offering->rate, 3) . '%' ?></div>
                <div class="col-sm-12"><hr /></div>
                
                <!-- Investor information
                --------------------------------------------------------->
                <div class="col-sm-6"><strong>Investor name</strong></div>
                <div class="col-sm-6"><?= $investor ?></div>
                <div class="col-sm-12"><hr /></div>
                
                <div class="col-sm-6"><strong>Investor account</strong></div>
                <div class="col-sm-6"><?= $investment->account->name ?></div>
                <div class="col-sm-12"><hr /></div>
                
                <!-- Investment information
                --------------------------------------------------------->
                <div class="col-sm-6"><strong>Investment amount</strong></div>
                <div class="col-sm-6"><?= '$' . number_format($investment->amount, 2) ?></div>
                <div class="col-sm-12"><hr /></div>
                
                <div class="col-sm-6"><strong>Investment funding date</strong></div>
                <div class="col-sm-6"><?= $investment->date->format('m/d/Y') ?></div>
                <div class="col-sm-12"><hr /></div>
                
                <div class="col-sm-6"><strong>Investment term</strong></div>
                <div class="col-sm-6"><?= $investment->term ?> months</div>
                <div class="col-sm-12"><hr /></div>
                
                <!-- Current information
                --------------------------------------------------------->
                <div class="col-sm-6"><strong>Investment balance</strong></div>
                <div class="col-sm-6"><?= '$' . number_format($investment->balance, 2) ?></div>
                
            </div>
            
            <h2 style="margin-top: 50px; margin-bottom: 20px;">Transaction summary</h2>
            
            <table class="table table-bordered">
                <thead>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Transaction type</th>
                </thead>
                <tbody>
                    <?php foreach ($investment->transactions as $transaction): ?>
                    <tr>
                        <td><?= $transaction->date->format('m/d/Y') ?></td>
                        <td><?= '$' . number_format($transaction->amount, 2) ?></td>
                        <td><?= $transactionTypes[$transaction->type] ?></td>
                    </tr>
                    <?php endforeach ?>
                </tbody>
            </table>
            
            <p>
                If you have any questions or discrepancies please contact the Investor Relations Department by phone: (877) 395-1290, or by email: mheineman@pprnoteco.com.
            </p>
            
        </section>
        
        <footer>
            <hr />
        </footer>
        
    </body>
</html>