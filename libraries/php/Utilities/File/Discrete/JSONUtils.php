<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 16:16
 */

namespace QuasarSource\Utilities\File\Discrete;

use Exception;
use QuasarSource\Utilities\Exception\ExceptionSystem;
use QuasarSource\Utilities\File\UtilsFile;

/**
 * Class JSONUtilities
 * @package QuasarSource\Utilities\File\Discrete
 */
final class JSONUtils extends UtilsFile {

    /**
     * Returns the contents of a YAML file as an association array.
     *
     * @param string $path [The path to the (yml/yaml) file to get contents of.]
     * @return array       [An association array of the file's contents.       ]
     * @throws ExceptionSystem
     */
    public static function get(string $path): array {
        try {
            self::is_valid($path);
            return json_decode(file_get_contents($path));
        } catch (Exception $e) {
            throw self::exception('get{json_content}', $e->getMessage());
        }
    }
}
