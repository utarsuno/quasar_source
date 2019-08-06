<?php declare(strict_types=1);

namespace QuasarSource\Utils\File\Discrete;

use Exception;
use QuasarSource\Utils\File\UtilsFile;
use Symfony\Component\Yaml\Yaml;

/**
 * Class UtilsYAML
 * @package QuasarSource\Utils\File\Discrete
 */
final class UtilsYAML extends UtilsFile {

    /**
     * Returns the contents of a YAML file as an association array.
     *
     * @param  string $path      {path to the (yml/yaml) file to get contents of}
     * @param  bool   $as_string {}
     * @return array             {association array of the file's contents      }
     */
    public static function get(string $path, bool $as_string=false) {
        self::is_valid($path);
        try {
            return Yaml::parseFile($path);
        } catch (Exception $e) {
            throw self::exception('get', $e->getMessage());
        }
    }
}
