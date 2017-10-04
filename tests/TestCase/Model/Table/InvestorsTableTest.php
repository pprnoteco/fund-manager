<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\InvestorsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\InvestorsTable Test Case
 */
class InvestorsTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\InvestorsTable
     */
    public $Investors;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.investors'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('Investors') ? [] : ['className' => InvestorsTable::class];
        $this->Investors = TableRegistry::get('Investors', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Investors);

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
