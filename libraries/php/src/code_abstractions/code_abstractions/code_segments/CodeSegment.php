<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-25
 * Time: 18:39
 */

namespace QuasarSource\CodeAbstractions\CodeAbstractions\CodeSegments;
require_once '/quasar_source/libraries/php/autoload.php';

class CodeSegment {

    private $lines;

    public function __construct() {
        $this->lines = [];
    }

}
