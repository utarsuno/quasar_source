<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-27
 * Time: 22:21
 */

namespace CodeManager\Tests;
use QuasarSource\QualityAssurance\FileTestSuite;
use QuasarSource\Utilities\StringUtilities as STR;


class StringUtilitiesTest extends FileTestSuite {

    protected $class_to_test = STR::class;

    public function test_get_matches_removed() : void {
        $this->assert_equals_scenarios(
            'get_matches_removed',
            [
                # Expected Result, To search, To Remove.
                # ['hello ', 'hello world', 'world'],
                ['hello ', 'hello world', 'worlASDASDC#Rd'],
                ['expected_output', 'expectedto_remove_output', 'to_remove'],
                ['', '', ''],
                ['', ' ', ' ']
            ]
        );
    }

    public function test_contains() : void {
        $this->assert_positive_and_negative_scenarios(
            'contains',
            [
                # Positive scenarios.
                [' ', ' '],
                ['abc', 'a'],
                ['abc', 'b'],
                ['abc', 'c'],
                ['abc', 'ab'],
                ['abc', 'bc'],
                ['abc', 'abc'],
                ['ACDMabcQRST', 'abc'],
            ],
            [
                # Negative scenarios.
                ['Abc', 'abc'],
                ['abc', 'd'],
                ['abc ', ''],
                ['abc', ' '],
                ['', ''],
                [' ', ''],
                [' ', ''],
            ]
        );
    }

    public function test_starts_with() : void {
        $this->assert_positive_and_negative_scenarios(
            'starts_with',
            [
                ['abc', 'a'],
                ['abc', 'ab'],
                ['abc', 'abc'],
                [' abc ', ' '],
                [' ', ' '],
            ],
            [
                ['abc', 'b'],
                ['abc', ''],
                ['abc ', ' '],
                [' ', ''],
                ['', ''],
                ['', ' '],
            ]
        );
    }

    public function test_ends_with() : void {
        $this->assert_positive_and_negative_scenarios(
            'ends_with',
            [
                ['abc', 'c'],
                ['abc', 'bc'],
                ['abc', 'abc'],
                ['abc ', ' '],
            ],
            [
                ['abc', ''],
                ['abc', ' '],
                ['', ''],
                [' ', ''],
            ]
        );
    }

}
