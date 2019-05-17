<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-27
 * Time: 22:21
 */

namespace CodeManager\Tests;
use QuasarSource\QualityAssurance\FileTestSuite;
use QuasarSource\Utilities\Files\PathUtilities as PATH;


class PathUtilitiesTest extends FileTestSuite {

    private const DATA = '/a/b/c';

    public function test_remove_layer(): void {
        // Positive cases.
        $this->assertSame('/a/b/', PATH::remove_layer(self::DATA));
        $this->assertSame('/a/b/', PATH::remove_layer(self::DATA . '/'));
        $this->assertSame('/', PATH::remove_layer('/a'));
        $this->assertSame('/', PATH::remove_layer('/'));
    }

    public function test_is_valid(): void {
        // Positive cases.
        $this->assertTrue(PATH::is_valid(PATH::UTILITIES_TEST));
        // Negative cases.
        $this->assertFalse(PATH::is_valid(PATH::UTILITIES_TEST . 'fake_path'));
    }

}
