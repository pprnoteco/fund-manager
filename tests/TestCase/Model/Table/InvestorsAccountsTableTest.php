<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\InvestorsAccountsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\InvestorsAccountsTable Test Case
 */
class InvestorsAccountsTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\InvestorsAccountsTable
     */
    public $InvestorsAccounts;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.investors_accounts'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('InvestorsAccounts') ? [] : ['className' => InvestorsAccountsTable::class];
        $this->InvestorsAccounts = TableRegistry::get('InvestorsAccounts', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->InvestorsAccounts);

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
