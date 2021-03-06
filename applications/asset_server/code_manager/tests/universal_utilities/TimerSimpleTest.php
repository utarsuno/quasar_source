<?php declare(strict_types=1);

namespace CodeManager\Tests;
use QuasarSource\QualityAssurance\FileTestSuite;
use QuasarSource\Utils\Time\TimerSimple;

/**
 * Class TimerSimpleTest
 * @package CodeManager\Tests
 */
class TimerSimpleTest extends FileTestSuite {

    public function test_simple_timer(): void {
        $timer = new TimerSimple(true);
        usleep(250000);
        $this->assertLessThan(.35, $timer->get_delta());
        usleep(500000);
        $this->assertLessThan(.9, $timer->get_delta());
        usleep(100000);
        $timer->stop();
        usleep(500000);
        $this->assertGreaterThan(.75, $timer->get_delta());
        $this->assertLessThan(.9, $timer->get_delta());
    }

    public function test_simple_timer_syntax(): void {
        $timer = new TimerSimple(true);
        $this->assertSame('0s', strval($timer));
    }

}
