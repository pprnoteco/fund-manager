<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\FundsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\FundsTable Test Case
 */
class FundsTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\FundsTable
     */
    public $Funds;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.funds'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('Funds') ? [] : ['className' => FundsTable::class];
        $this->Funds = TableRegistry::get('Funds', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Funds);

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
