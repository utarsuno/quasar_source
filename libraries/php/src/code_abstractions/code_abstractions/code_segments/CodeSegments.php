<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-25
 * Time: 18:39
 */

namespace QuasarSource\CodeAbstractions\CodeAbstractions\CodeSegments;
use QuasarSource\CodeAbstractions\CodeAbstractions\Comment;
use QuasarSource\CodeAbstractions\CodeAbstractions\EmptyLine;
use QuasarSource\CodeAbstractions\CodeAbstractions\LineOfCode;
use QuasarSource\Utilities\StringUtilities as STR;
use QuasarSource\Utilities\ArrayUtilities as ARY;

require_once '/quasar_source/libraries/php/autoload.php';

class CodeSegments {

    private $segments;
    private $last_line_number;

    public function __construct(array $code_segments=[]) {
        $this->segments         = $code_segments;
        $this->last_line_number = 1;
    }

    public function add_comment(string $line, bool $add_to_start=false) : void {
        if (!STR::ends_with($line, PHP_EOL)) {
            $line .= PHP_EOL;
        }
        if (!$add_to_start) {
            $this->segments[] = new Comment($line, $this->last_line_number);
            ++$this->last_line_number;
        } else {
            $this->apply_line_number_delta(1);
            array_unshift($this->segments, new Comment($line, 1));
        }
    }

    public function add_empty_line(bool $add_to_start=false) : void {
        if (!$add_to_start) {
            $this->segments[] = new EmptyLine(PHP_EOL, $this->last_line_number);
            ++$this->last_line_number;
        } else {
            $this->apply_line_number_delta(1);
            array_unshift($this->segments, new EmptyLine(PHP_EOL,1));
        }
    }

    public function add_line(string $line, bool $add_to_start=false) : void {
        if (!STR::ends_with($line, PHP_EOL)) {
            $line .= PHP_EOL;
        }
        if (!$add_to_start) {
            $this->segments[] = new LineOfCode($line, $this->last_line_number);
            ++$this->last_line_number;
        } else {
            $this->apply_line_number_delta(1);
            array_unshift($this->segments, new LineOfCode($line, 1));
        }
    }

    public function remove_all_after_and_before(LineOfCode $start, LineOfCode $end) : void {

    }

    public function remove_all_before(LineOfCode $line_to_keep) : void {
        $delta = $line_to_keep->get_line_number() - 1;

        ARY::remove_first_n($this->segments, $delta);

        $this->apply_line_number_delta(-$delta);
    }

    private function apply_line_number_delta(int $delta) : void {
        $this->last_line_number += $delta;
        foreach ($this->segments as $line) {
            $line->apply_line_number_delta($delta);
        }
    }

    public function get_line_with_text(string $text) : ?LineOfCode {
        foreach ($this->segments as $segment) {
            if ($segment->has_text($text)) {
                return $segment;
            }
        }
        return null;
    }

    public function get_segments() : array {
        return $this->segments;
    }

}
