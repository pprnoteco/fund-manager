<div class="container">
    
    <h2 class="page-header">
        <span class="fa fa-dashboard"></span>
        Dashboard
    </h2>
    
    <hr />
    
    <div class="row">
        <div class="col-sm-12">
            <canvas id="investments-line-chart" height="400" style="width: 100%;"></canvas>
        </div>
    </div>
</div>

<?php $this->start('script') ?>
<script>
(function () {
    
    (function () {
        
        var capitalRaisedByMonth = <?= json_encode($capitalRaisedByMonth) ?>;
        
        var context = document.getElementById('investments-line-chart').getContext('2d');
        
        var data = {
            labels: _.keys(capitalRaisedByMonth),
            datasets: [{data: _.values(capitalRaisedByMonth)}]
        }
        
        var options = {
            responsive: false,
            title: {
                display: true,
                text: 'Capital raised by month\n',
                fontSize: 20
            },
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function (value, index, values) {
                            return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }
                    }
                }]
            },
            legend: { display: false }
        };
        
        var chart = new Chart(context, {type: 'line', data: data, options: options});
        
    }());
    
}());
</script>
<?php $this->end() ?>