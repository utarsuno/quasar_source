<?php declare(strict_types=1);

namespace CodeManager\Tests;

use QuasarSource\QualityAssurance\FileTestSuite;
use QuasarSource\Utils\DataType\UtilsArray;
use QuasarSource\Utils\File\UtilsDirectory as DIR;
use QuasarSource\Utils\File\UtilsPath as PATH;


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
        $this->assertTrue(UtilsArray::string_arrays_have_same_values(self::$files, $all_files)
        );

        // Negative test cases.
        self::$files = [];
        self::$dirs  = [];
        DIR::get_all_contents($search_directory, false, self::$files, self::$dirs);
        // Positive test cases.
        $this->assertSame(self::$dirs, [$search_directory . 'files']);
        $this->assertTrue(UtilsArray::string_arrays_have_same_values(self::$files, $base_files));
    }



}
