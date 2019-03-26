<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-25
 * Time: 18:39
 */

namespace QuasarSource\CodeAbstractions\CodeAbstractions;
require_once '/quasar_source/libraries/php/autoload.php';

class Comment extends LineOfCode {

    public function __construct(string $line, int $line_number) {
        parent::__construct($line, $line_number, LineOfCode::LINE_TYPE_COMMENT);
    }

}