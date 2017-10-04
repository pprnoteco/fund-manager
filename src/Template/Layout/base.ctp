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
        
        <title>Fund manager</title>
        <link rel="icon" type="image/png" href="<?= $this->url('/favicon.png') ?>?v1">

        <!-- CSS
        ----------------------------------------------------------------->
        
        <?= $this->html->css('bootstrap.min.css') . "\n" ?>
        <?= $this->html->css('bootstrap-datepicker.min.css') . "\n" ?>
        <?= $this->html->css('font-awesome.min.css') . "\n" ?>
        <?= $this->html->css('style.css?v1') . "\n" ?>
        
    </head>
    <body>
        
        <!-- Content
        ----------------------------------------------------------------->
        <?= $this->fetch('content') ?>
        
        <!-- Javascript
        ----------------------------------------------------------------->
        
        <?= $this->html->script('jquery.min.js'). "\n" ?>
        <?= $this->html->script('popper.min.js'). "\n" ?>
        <?= $this->html->script('bootstrap.min.js'). "\n" ?>
        <?= $this->html->script('bootstrap-datepicker.min.js') . "\n" ?>
        <?= $this->html->script('underscore-min.js'). "\n" ?>
        <?= $this->html->script('backbone-min.js'). "\n" ?>
        <?= $this->html->script('moment.min.js'). "\n" ?>
        <?= $this->html->script('chart.min.js'). "\n" ?>
        <?= $this->html->script('dist/app.js'). "\n" ?>
        <script>
        (function (App) {
            App.urlRoot = '<?= $this->url('/', true) ?>';
        }(App))
        </script>
        <?= $this->fetch('script') ?>
        
    </body>
</html>
