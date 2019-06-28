<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-27
 * Time: 22:21
 */

namespace CodeManager\Tests;
use QuasarSource\QualityAssurance\FileTestSuite;
use QuasarSource\Utilities\ArrayUtilities;
use QuasarSource\Utilities\File\DirectoryUtilities as DIR;
use QuasarSource\Utilities\File\PathUtilities as PATH;


class DirectoryUtilitiesTest extends FileTestSuite {

    private static $files = [];
    private static $dirs  = [];

    public function test_get_all_contents() : void {
        $search_directory = PATH::remove_layer(__DIR__);
        DIR::get_all_contents($search_directory, true, self::$files, self::$dirs);
        $base_files       = [
            $search_directory . 'StringUtilitiesTest.php',
            $search_directory . 'SimpleTimerTest.php',
            $search_directory . 'MathUtilitiesTest.php',
            $search_directory . 'ArrayUtilitiesTest.php',
        ];
        $all_files        = [
            $search_directory . 'files/FileUtilitiesTest.php',
            $search_directory . 'files/DirectoryUtilitiesTest.php',
            $search_directory . 'files/PathUtilitiesTest.php'
        ];
        foreach ($base_files as $f) {
            $all_files[] = $f;
        }

        // Positive test cases.
        $this->assertSame(self::$dirs, [$search_directory . 'files']);
        $this->assertTrue(ArrayUtilities::string_arrays_have_same_values(self::$files, $all_files)
        );

        // Negative test cases.
        self::$files = [];
        self::$dirs  = [];
        DIR::get_all_contents($search_directory, false, self::$files, self::$dirs);
        // Positive test cases.
        $this->assertSame(self::$dirs, [$search_directory . 'files']);
        $this->assertTrue(ArrayUtilities::string_arrays_have_same_values(self::$files, $base_files));
    }



}
