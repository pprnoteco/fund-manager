<h1 class="page-header">
    <span class="fa fa-file-pdf-o"></span>
    Statements
    <small>Sync FTP</small>
</h1>

<hr />

<button class="btn btn-primary" id="submit">
    Check statements
</button>

<hr />

<div class="progress">
    <div id="progress" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
</div>

<?php $this->start('script') ?>
<script>
    var submit = document.getElementById('submit');
    var progress = document.getElementById('progress');
    var statements = <?= json_encode($statements) ?>;
    
    _.chunk = function(array, chunkSize) {
        return _.reduce(array,function(reducer,item,index) {
            reducer.current.push(item);
            if(reducer.current.length === chunkSize || index + 1 === array.length) {
                reducer.chunks.push(reducer.current);
                reducer.current = [];
            }
            return reducer;
        },{current:[],chunks: []}).chunks
    };
    
    function start() {
        
        var nonexist = 0;
        var completed = 0;
        var chunks = _.chunk(statements, 20);
        var len = chunks.length;
        var i = 0;
        
        for(; i < len; i++) {
            $.ajax({
                url: App.url('ftp/exists'),
                type: 'post',
                data: {
                    files: chunks[i]
                },
                complete: function (data) {
                    completed++;
                    var per = (completed / len) * 100;
                    for (var x = 0, xlen = data.length; x < xlen; x++) {
                        if (data[x].exists == false) nonexist++;
                    }
                    progress.style.width = per + '%';
                    if (per == 100) alert(nonexist + ' do no exist');
                }
            });
        }
        
    }
    
    submit.onclick = start;
    
</script>
<?php $this->end() ?>