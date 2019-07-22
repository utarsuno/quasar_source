<?php declare(strict_types=1);

namespace QuasarSource\Utils\File\Discrete;

use Exception;
use QuasarSource\Utils\Exception\ExceptionSystem;
use QuasarSource\Utils\File\UtilsFile;
use Symfony\Component\Yaml\Yaml;

/**
 * Class YAMLUtilities
 * @package QuasarSource\Utils\File\Discrete
 */
final class YAMLUtils extends UtilsFile {

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
