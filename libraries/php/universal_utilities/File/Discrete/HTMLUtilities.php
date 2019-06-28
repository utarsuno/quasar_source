<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 16:16
 */

namespace QuasarSource\Utilities\File\Discrete;

use Exception;
use QuasarSource\Utilities\File\FileUtilities;
use QuasarSource\Utilities\Process\ProcessUtilities as RUN;

/**
 * Class HTMLUtilities
 * @package QuasarSource\Utilities\File\Discrete
 */
final class HTMLUtilities extends FileUtilities {

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
