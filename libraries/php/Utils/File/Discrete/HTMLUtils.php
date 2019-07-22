<?php declare(strict_types=1);

namespace QuasarSource\Utils\File\Discrete;

use Exception;
use QuasarSource\Utils\File\UtilsFile;
use QuasarSource\Utils\Process\UtilsProcess as RUN;

/**
 * Class HTMLUtilities
 * @package QuasarSource\Utils\File\Discrete
 */
final class HTMLUtils extends UtilsFile {

    /**
     * @param string $path_base
     * @param string $path_output
     */
    public static function minify(string $path_base, string $path_output): void {
        try{
            self::is_valid($path_base);
            RUN::minify_file_html_to($path_base, $path_output);
        } catch (Exception $e) {
            throw self::exception('minify_html', $e->getMessage());
        }
    }

}
