<?php
namespace App\Shell\Task;

use Cake\Utility\Inflector;
use Cake\Console\Shell;

class JavascriptTask extends TemplatesTask
{
    public $pathFragment = 'Webroot/js/';

    public $scaffoldActions = [
        'app',
        'model',
        'collection',
        'view',
        'toolbar',
        'table',
        'panel',
        'form/create',
        'form/update',
        'form/delete',
        'profile/read',
        'profile/delete',
        'modal/create',
        'modal/read',
        'modal/update',
        'modal/delete',
        'views/index',
        //'views/read',
        'views/import',
        'views/export'
    ];
    
    public function main($name = null, $template = null, $action = null)
    {
        if (empty($name)) {
            $this->out('Possible tables to bake view templates for based on your current database:');
            $this->Model->connection = $this->connection;
            foreach ($this->Model->listUnskipped() as $table) {
                $this->out('- ' . $this->_camelize($table));
            }

            return true;
        }
        $name = $this->_getName($name);
        
        $controller = null;
        if (!empty($this->params['controller'])) {
            $controller = $this->params['controller'];
        }
        $this->controller($name, $controller);
        $this->model($name);

        if (isset($template)) {
            $this->template = $template;
        }
        if (!$action) {
            $action = $this->template;
        }
        if ($action) {
            return $this->bake($action, true);
        }

        $vars = $this->_loadController();
        $methods = $this->_methodsToBake();

        foreach ($methods as $method) {
            $content = $this->getContent($method, $vars);
            if ($content) {
                $this->bake($method, $content);
            }
        }
    }
    
    protected function _methodsToBake()
    {
        return $this->scaffoldActions;
    }
    
    public function getPath()
    {
        $controllerName = strtolower(Inflector::slug(
            Inflector::underscore($this->controllerName), '-'
        ));
        return 'C:\\app\\fund-manager\\webroot\\js\\src' . DS . $controllerName . DS;
    }
    
    public function all()
    {
        $this->Model->connection = $this->connection;
        $tables = $this->Model->listUnskipped();

        foreach ($tables as $table) {
            $this->main($table);
        }
    }
    
    public function getContent($action, $vars = null)
    {
        if (!$vars) {
            $vars = $this->_loadController();
        }

        if (empty($vars['primaryKey'])) {
            $this->error('Cannot generate views for models with no primary key');

            return false;
        }

        if ($action === "index" && !empty($this->params['index-columns'])) {
            $this->BakeTemplate->set('indexColumns', $this->params['index-columns']);
        }

        $this->BakeTemplate->set('action', $action);
        $this->BakeTemplate->set('plugin', $this->plugin);
        $this->BakeTemplate->set($vars);

        return $this->BakeTemplate->generate("Webroot/js/$action");
    }
    
    public function bake($action, $content = '')
    {
        if ($content === true) {
            $content = $this->getContent($action);
        }
        if (empty($content)) {
            $this->err("<warning>No generated content for '{$action}.ctp', not generating template.</warning>");

            return false;
        }
        $this->out("\n" . sprintf('Baking `%s` view template file...', $action), 1, Shell::QUIET);
        $path = $this->getPath();
        $filename = $path . Inflector::underscore($action) . '.js';
        $this->createFile($filename, $content);

        return $content;
    }
}
