<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-27
 * Time: 22:21
 */

namespace QuasarSource\Utilities;
use QuasarSource\Utilities\StringUtilities as STR;
use PHPUnit\Framework\TestCase;
require_once '/quasar_source/libraries/php/autoload.php';


class StringUtilitiesTest extends TestCase
{

    public function test_contains() : void {
        $this->assertTrue(STR::contains('abc', 'a'));
        $this->assertTrue(STR::contains('abc', 'b'));
        $this->assertTrue(STR::contains('abc', 'c'));
        $this->assertTrue(STR::contains('abc', 'ab'));
        $this->assertTrue(STR::contains('abc', 'bc'));
        $this->assertTrue(STR::contains('abc', 'abc'));
        $this->assertTrue(STR::contains('ABCDMabcQRST', 'abc'));
        $this->assertFalse(STR::contains('Abc', 'abc'));
        $this->assertFalse(STR::contains('abc', 'd'));
        $this->assertFalse(STR::contains('abc', ''));
    }

    public function test_starts_with() : void {
        $this->assertTrue(STR::starts_with('abc', 'a'));
        $this->assertTrue(STR::starts_with('abc', 'ab'));
        $this->assertTrue(STR::starts_with('abc', 'abc'));
        $this->assertTrue(STR::starts_with(' abc', ' '));
        $this->assertTrue(STR::starts_with(' ', ' '));
        $this->assertFalse(STR::starts_with('abc', 'b'));
        $this->assertFalse(STR::starts_with('abc', ''));
        $this->assertFalse(STR::starts_with(' ', ''));
        $this->assertFalse(STR::starts_with('', ''));
    }

    public function test_ends_with() : void {
        $this->assertTrue(STR::ends_with('abc', 'c'));
        $this->assertTrue(STR::ends_with('abc', 'bc'));
        $this->assertTrue(STR::ends_with('abc', 'abc'));
        $this->assertTrue(STR::ends_with('abc ', ' '));
        $this->assertFalse(STR::ends_with('abc', ''));
        $this->assertFalse(STR::ends_with('abc ', ''));
        $this->assertFalse(STR::ends_with('', ''));
        $this->assertFalse(STR::ends_with(' ', ''));
    }

}
