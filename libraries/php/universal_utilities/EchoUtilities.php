<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 16:29
 */

namespace QuasarSource\Utilities;
use QuasarSource\Utilities\StringUtilities as STR;


abstract class EchoUtilities {

    public static function l($content): void {
        $contents = (string) $content;
        if (!STR::ends_with($contents, PHP_EOL)) {
            $contents .= PHP_EOL;
        }
        echo $contents;
    }

    public static function ll($text, $content): void {
        self::l($text . '{' . $content . '}');
    }

}
