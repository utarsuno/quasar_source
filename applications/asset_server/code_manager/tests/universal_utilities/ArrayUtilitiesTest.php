<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-27
 * Time: 22:21
 */

namespace CodeManager\Tests;
use QuasarSource\QualityAssurance\FileTestSuite;
use QuasarSource\Utilities\UtilsArray as ARY;


class ArrayUtilitiesTest extends FileTestSuite {

    protected $class_to_test = ARY::class;

    public function test_string_arrays_have_same_values(): void {
        $this->assert_equals_scenarios(
            'string_arrays_have_same_values',
            [
                # Expected Result, To search, To Remove.
                [true, ['a', 'b', 'c'], ['b', 'c', 'a']],
                [false, ['a', 'b', 'c'], ['b', 'b', 'b']]
            ]
        );
    }

    public function test_contains(): void {
        $simple_case = ['a', 'b', 'c'];
        // Positive cases.
        $this->assertTrue(ARY::contains($simple_case, 'a'));
        $this->assertTrue(ARY::contains($simple_case, 'b'));
        $this->assertTrue(ARY::contains($simple_case, 'c'));
        // Negative cases.
        $this->assertFalse(ARY::contains($simple_case, 'e'));
        $this->assertFalse(ARY::contains($simple_case, ' '));
        $this->assertFalse(ARY::contains($simple_case, ''));
    }

    public function test_remove_first_n(): void {
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
