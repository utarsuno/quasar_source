<?php declare(strict_types=1);

namespace QuasarSource\Utils\File;

use InvalidArgumentException;
use QuasarSource\Utils\DataType\UtilsString as STR;

/**
 * Class UtilsPath
 * @package QuasarSource\Utils\File
 */
abstract class UtilsPath {

    private static $cwd;

    /**
     * @param  string $path
     * @param  bool   $raise_exception_if_not
     * @return bool
     */
    public static function is_valid(string $path, bool $raise_exception_if_not=true): bool {
        if ($raise_exception_if_not && !is_file($path) && !is_dir($path)) {
            throw new InvalidArgumentException('Path{' . $path . '} does not exist!');
        }
        return true;
    }

    /**
     * Returns a string representing the provided path with 1 less directory depth (if not already at base directory).
     *
     * @param string $path [The path to remove a layer from.                                                    ]
     * @return string      [A new string representing the path provided with potentially 1 less directory depth.]
     */
    public static function remove_layer(string $path): string {
        $path === DIRECTORY_SEPARATOR ? DIRECTORY_SEPARATOR :
            STR::remove_after(STR::ensure_ending_is_not($path, DIRECTORY_SEPARATOR), DIRECTORY_SEPARATOR);
        if ($path === DIRECTORY_SEPARATOR) {
            return '/';
        }
        return STR::remove_after(STR::ensure_ending_is_not($path, '/'), '/');
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

    /**
     * @param  string $path
     * @return string
     */
    public static function get_directory(string $path): string {
        return pathinfo($path, PATHINFO_DIRNAME) . '/';
    }

    /**
     * @param  string $path
     * @return string
     */
    public static function get_file_full_name(string $path): string {
        return pathinfo($path, PATHINFO_FILENAME) . self::get_ending_extension($path);
    }

    /**
     * @param  string $path
     * @return string
     */
    public static function get_extensions_as_string(string $path): string {
        if (STR::does_not_have($path, '.')) {
            return '';
        }
        $full_name = self::get_file_full_name($path);
        return STR::remove($full_name, STR::keep_all_before($full_name, '.'));
    }

    /**
     * @param  string $path
     * @return array
     */
    public static function get_extensions(string $path): array {
        $full_name  = self::get_file_full_name($path);
        if (!STR::has($path, '.') || (STR::has_only_one($path, '.') && STR::ends_with($path, '.'))) {
            return [];
        }
        $extensions = STR::remove($full_name, STR::keep_all_before($full_name, '.'));
        return STR::split($extensions, '.', true);
    }

    /**
     * @param  string $path
     * @return string
     */
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

    /**
     * @param  string $path
     * @return array
     */
    public static function get_all_path_segments(string $path): array {
        $directory  = self::get_directory($path);
        $extensions = self::get_extensions_as_string($path);
        $file_name  = STR::remove_twice($path, $directory, $extensions);
        return [$directory, $file_name, $extensions];
    }

}
