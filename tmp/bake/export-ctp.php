<!-- Template\<?= ucfirst($pluralVar) ?>: Export
-------------------------------------------------------------------------->

<!-- Heading
-------------------------------------------------------------------------->

<h2 class="page-header">
    <?= $pluralHumanName . "\n" ?>
    <small class="text-muted">Export</small>
</h2>

<hr />
    
<!-- Breadcrumb
----------------------------------------------------------------->

<ol class="breadcrumb">

    <li class="breadcrumb-item">
        <a href="<CakePHPBakeOpenTag= $this->url('/') CakePHPBakeCloseTag>">Home</a>
    </li>
    
    <li class="breadcrumb-item">
        <a href="<CakePHPBakeOpenTag= $this->url('/<?= $slug ?>') CakePHPBakeCloseTag>"><?= $pluralHumanName ?></a>
    </li>
    
    <li class="breadcrumb-item active">Export</li>

</ol>

<div class="list-group">
    
    <a class="list-group-item list-group-item-action" href="#">
        <span class="fa fa-download fa-fw"></span>&nbsp;
        Download CSV
    </a>
    
    <a class="list-group-item list-group-item-action" href="#">
        <span class="fa fa-file-pdf-o fa-fw"></span>&nbsp;
        Download PDF
    </a>
    
    <a class="list-group-item list-group-item-action" href="#">
        <span class="fa fa-code fa-fw"></span>&nbsp;
        Download XML
    </a>
    
    <a class="list-group-item list-group-item-action" href="#">
        <span class="fa fa-code fa-fw"></span>&nbsp;
        Download JSON
    </a>
    
</div>
