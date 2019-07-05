<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-25
 * Time: 18:39
 */

namespace QuasarSource\CodeAbstractions\CodeAbstractions;
use QuasarSource\Utilities\DataType\UtilsString as STR;

class LineOfCode {

    public const LINE_TYPE_TEXT    = 'Text';
    public const LINE_TYPE_COMMENT = 'Comment';
    public const LINE_TYPE_EMPTY   = 'Empty';

    private $raw_line;
    private $line_number;
    private $line_type;

    public function __construct(string $raw_line, int $line_number, string $line_type=self::LINE_TYPE_TEXT) {
        $this->raw_line    = $raw_line;
        $this->line_type   = $line_type;
        $this->line_number = $line_number;
    }

    public function has_text(string $text): bool {
        return STR::has($this->raw_line, $text);
    }

    public function get_line_number(): int {
        return $this->line_number;
    }

    public function get_line_type(): string {
        return $this->line_type;
    }

    public function __toString(): string {
        return $this->raw_line;
    }

    public function apply_line_number_delta(int $delta): void {
        $this->line_number += $delta;
    }

}
