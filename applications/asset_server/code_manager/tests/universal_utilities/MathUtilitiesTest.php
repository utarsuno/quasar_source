<?php declare(strict_types=1);

namespace CodeManager\Tests;

use QuasarSource\QualityAssurance\FileTestSuite;
use QuasarSource\Utils\Math\UtilsMath as MATH;

class MathUtilitiesTest extends FileTestSuite {

    public function test_percentage_decreased(): void {
        $this->assertLessThan(.41, MATH::percentage_decreased(2.5, 1.5, false));
    }

}
