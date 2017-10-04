<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\OfferingsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\OfferingsTable Test Case
 */
class OfferingsTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\OfferingsTable
     */
    public $Offerings;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.offerings'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('Offerings') ? [] : ['className' => OfferingsTable::class];
        $this->Offerings = TableRegistry::get('Offerings', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Offerings);

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
