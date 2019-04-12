<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-27
 * Time: 22:21
 */

namespace QuasarSource\Utilities;
use QuasarSource\QualityAssurance\FileTestSuite;
use QuasarSource\Utilities\ArrayUtilities as ARY;
require_once '/quasar_source/libraries/php/autoload.php';


class ArrayUtilitiesTest extends FileTestSuite {

    protected $class_to_test = ARY::class;

    public function test_remove_first_n() : void {

        $test_data = ['a', 'b', 'c', 'd'];
        ARY::remove_first_n($test_data, 2);
        $this->assertSame(['c', 'd'], $test_data);

        ARY::remove_first_n($test_data, 0);
        $this->assertSame(['c', 'd'], $test_data);

        ARY::remove_first_n($test_data, 1);
        $this->assertSame(['d'], $test_data);

        ARY::remove_first_n($test_data, 1);
        $this->assertSame([], $test_data);

    }

}
