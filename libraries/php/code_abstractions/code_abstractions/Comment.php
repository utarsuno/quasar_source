<?php declare(strict_types=1);

namespace QuasarSource\CodeAbstractions\CodeAbstractions;

class Comment extends LineOfCode {

    public function __construct(string $line, int $line_number) {
        parent::__construct($line, $line_number, LineOfCode::LINE_TYPE_COMMENT);
    }

}