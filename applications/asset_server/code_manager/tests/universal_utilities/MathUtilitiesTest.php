<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-27
 * Time: 22:21
 */

namespace CodeManager\Tests;
use QuasarSource\QualityAssurance\FileTestSuite;
use QuasarSource\Utilities\MathUtilities as MATH;


class MathUtilitiesTest extends FileTestSuite {

    public function test_get_percentage_decreased(): void {
        $this->assertLessThan(.41, MATH::get_percentage_decreased(2.5, 1.5, false));
    }

}
