<?php declare(strict_types=1);

namespace CodeManager\Tests;
use QuasarSource\QualityAssurance\FileTestSuite;
use QuasarSource\Utils\DataType\UtilsString as STR;

class StringUtilitiesTest extends FileTestSuite {

    protected $class_to_test = STR::class;

    public function test_remove(): void {
        $this->assert_equals_scenarios(
            'remove',
            [
                # Expected Result, To search, To Remove.
                ['hello ', 'hello world', 'world'],
                ['expected_output', 'expectedto_remove_output', 'to_remove'],
                ['', '', ''],
                ['', ' ', ' '],
                ['okie_dokie', 'ccc okieaaa_bbbdokieccc  aaa', ['aaa', 'bbb', 'ccc', ' ']]
            ]
        );
    }

    public function test_replace(): void {
        $this->assert_equals_scenarios(
            'replace',
            [
                # Expected Result, To search, To Remove.
                ['hello ', 'hello world', 'world', ''],
                ['expected_output', 'expected_wrong', 'wrong', 'output']
            ]
        );
    }

    public function test_split(): void {
        $this->assert_equals_scenarios(
            'split',
            [
                # Expected Result, To search, To Remove.
                [['a', 'b', 'c'], 'a.b.c', '.']
            ]
        );
    }

    public function test_contains(): void {
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

    public function test_ensure_start(): void {
        #$simple_case = 'png';
        #STR::ensure_start($simple_case, '.');
        #$this->assertTrue(STR::starts_with($simple_case, '.'));
        #STR::ensure_start($simple_case, 'a');
        #$this->assertFalse(STR::starts_with($simple_case, '.'));
    }

    public function test_starts_with(): void {
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

    public function test_ends_with(): void {
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
