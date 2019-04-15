<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-27
 * Time: 22:21
 */

namespace QuasarSource\Utilities;
use QuasarSource\QualityAssurance\FileTestSuite;
require_once '/quasar_source/libraries/php/autoload.php';


class SimpleTimerTest extends FileTestSuite {

    public function test_simple_timer() : void {
        $timer = new SimpleTimer(true);
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

    public function test_simple_timer_syntax() : void {
        $timer = new SimpleTimer(true);
        $this->assertSame('0s', strval($timer));
    }

}
