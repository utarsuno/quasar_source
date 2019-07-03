<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 16:16
 */

namespace QuasarSource\Utilities\File\Discrete;

use function count;
use Exception;
use QuasarSource\Utilities\Exception\ExceptionSystem;
use QuasarSource\Utilities\Exception\LogicException;
use QuasarSource\Utilities\File\UtilsFile       as UFO;
use QuasarSource\Utilities\Process\UtilsProcess as RUN;

/**
 * Class CSSUtilities
 * @package QuasarSource\Utilities\File\Discrete
 */
final class CSSUtilities {

    /**
     * @param string $path_base
     * @param string $path_output
     */
    public static function minify(string $path_base, string $path_output): void {
        try{
            UFO::is_valid($path_base);
            RUN::minify_file_css_to($path_base, $path_output);
        } catch (Exception $e) {
            throw ExceptionSystem::file_exception('minify_css', $e->getMessage());
        }
    }

    /**
     * @param string $path
     * @return string
     */
    public static function get(string $path): string {
        $contents  = UFO::get($path);
        $num_lines = count($contents);
        if ($num_lines > 1) {
            throw LogicException::invalid_function_call('get', 'File{' . $path . '} has more than 1 line of code!');
        }
        if ($num_lines === 0) {
            throw LogicException::invalid_function_call('get', 'File{' . $path . '} has no contents!');
        }
        return $contents[0];
    }

}
