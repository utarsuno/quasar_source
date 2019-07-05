<?php declare(strict_types=1);

namespace QuasarSource\Utilities\File;

use function count;
use QuasarSource\Utilities\DataType\UtilsString as STR;

/**
 * Class UtilsPath
 * @package QuasarSource\Utilities\File
 */
abstract class UtilsPath {

    private static $cwd;

    /**
     * Returns a string representing the provided path with 1 less directory depth (if not already at base directory).
     *
     * @param string $path [The path to remove a layer from.                                                    ]
     * @return string      [A new string representing the path provided with potentially 1 less directory depth.]
     */
    public static function remove_layer(string $path): string {
        $path === DIRECTORY_SEPARATOR ? DIRECTORY_SEPARATOR :
            STR::remove_after_last_match(STR::ensure_ending_is_not($path, DIRECTORY_SEPARATOR), DIRECTORY_SEPARATOR);
        if ($path === DIRECTORY_SEPARATOR) {
            return '/';
        }
        return STR::remove_after_last_match(STR::ensure_ending_is_not($path, '/'), '/');
    }

    public static function get_current_cwd(): string {
        return getcwd();
    }

    public static function set_current_cwd(string $path): void {
        chdir($path);
    }

    public static function cwd_pop(): void {
        if (self::$cwd !== null) {
            chdir(self::$cwd);
            self::$cwd = null;
        }
    }

    public static function cwd_push(string $path): void {
        self::$cwd = getcwd();
        chdir($path);
    }

    public static function get_directory(string $path): string {
        return pathinfo($path, PATHINFO_DIRNAME) . '/';
    }

    public static function get_file_full_name(string $path): string {
        return self::get_file_name($path) . self::get_ending_extension($path);
    }

    /**
     * @param string $path
     * @return string
     */
    public static function get_file_name(string $path): string {
        return pathinfo($path, PATHINFO_FILENAME);
    }

    public static function get_all_extensions(string $path): ?array {
        $file_full_name = self::get_file_full_name($path);
        $extension = pathinfo($path, PATHINFO_EXTENSION);
        if ($extension === null || $extension === '') {
            return null;
        }
        if ($extension === '.') {
            return ['.'];
        }
        $extensions     = STR::split($file_full_name, '.');
        $num_extensions = count($extensions);
        if ($num_extensions > 1) {
            $return_extensions = [];
            for ($i = 1; $i < $num_extensions; $i++) {
                $return_extensions[] = '.' . $extensions[$i];
            }
            return $return_extensions;
        }
        return null;
    }

    public static function get_ending_extension(string $path): string {
        $extension = pathinfo($path, PATHINFO_EXTENSION);
        if ($extension === null || $extension === '') {
            return '';
        }
        if ($extension === '.') {
            return $extension;
        }
        return '.' . $extension;
    }

}
