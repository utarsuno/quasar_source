<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-27
 * Time: 22:21
 */

namespace CodeManager\Tests;
use QuasarSource\QualityAssurance\FileTestSuite;
use QuasarSource\Utilities\ArrayUtilities as ARY;


class ArrayUtilitiesTest extends FileTestSuite {

    protected $class_to_test = ARY::class;

    public function test_remove_first_n() : void {
        $simple_cases = ['a', 'b', 'c', 'd'];
        ARY::remove_first_n($simple_cases, 2);
        $this->assertSame(['c', 'd'], $simple_cases);

        ARY::remove_first_n($simple_cases, 0);
        $this->assertSame(['c', 'd'], $simple_cases);

        ARY::remove_first_n($simple_cases, 1);
        $this->assertSame(['d'], $simple_cases);

        ARY::remove_first_n($simple_cases, 1);
        $this->assertSame([], $simple_cases);


        $edge_cases = ['a', 'b', 'c', 'd'];
        ARY::remove_first_n($edge_cases, 0);
        $this->assertSame(['a', 'b', 'c', 'd'], $edge_cases);
        ARY::remove_first_n($edge_cases, 1337);
        $this->assertSame([], $edge_cases);
    }

}
