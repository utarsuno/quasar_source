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
use QuasarSource\Utilities\File\FileUtilities;
use Symfony\Component\Yaml\Yaml;

/**
 * Class YAMLUtilities
 * @package QuasarSource\Utilities\File\Discrete
 */
final class YAMLUtilities extends FileUtilities {

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
            return Yaml::parseFile($path);
        } catch (Exception $e) {
            throw self::exception('get', $e->getMessage());
        }
    }
}
