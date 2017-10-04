<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\StatementsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\StatementsTable Test Case
 */
class StatementsTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\StatementsTable
     */
    public $Statements;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.statements'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('Statements') ? [] : ['className' => StatementsTable::class];
        $this->Statements = TableRegistry::get('Statements', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Statements);

        parent::tearDown();
    }

    /**
     * Test initialize method
     *
     * @return void
     */
    public function testInitialize()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }
}
