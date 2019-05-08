<?php


namespace QuasarSource\Utilities\Files;

use Exception;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;
use QuasarSource\Utilities\StringUtilities               as STR;


abstract class PathUtilities {

    private static $cwd;

    /**
     * Checks if a provided path is both valid and that it points to something existing.
     *
     * @param string $path                   < The string content to verify as a valid, existing, path.       >
     * @param bool   $raise_exception_if_not < If the provided path is not valid then an exception is thrown. >
     * @return bool
     * @throws Exception
     */
    public static function is_valid(string $path, bool $raise_exception_if_not=false) : bool {
        // N O T E : Ensure that file check is performed first as that condition is more likely.
        $is_path_valid = ($path !== '') && (is_file($path) || is_dir($path));
        if ($raise_exception_if_not && !$is_path_valid) {
            DBG::throw_exception('Invalid path{' . $path . '}');
        }
        return $is_path_valid;
    }

    /**
     * Returns a string representing the provided path with 1 less directory depth (if not already at base directory).
     *
     * @param string $path < The path to remove a layer from.                                                     >
     * @return string      < A new string representing the path provided with potentially 1 less directory depth. >
     */
    public static function remove_layer(string $path) : string {
        if ($path === '/') {
            return '/';
        }
        if (STR::ends_with($path, '/')) {
            return STR::indexed_inclusive_to_last_match(STR::indexed($path, 0, strlen($path) - 2), '/');
        }
        return STR::indexed_inclusive_to_last_match($path, '/');
    }


    public static function cwd_pop() : void {
        if (self::$cwd !== null) {
            chdir(self::$cwd);
            self::$cwd = null;
        }
    }

    public static function cwd_push(string $path) : void {
        self::$cwd = getcwd();
        chdir($path);
    }

    public static function get_directory(string $path) : string {
        return pathinfo($path, PATHINFO_DIRNAME) . '/';
    }

    public static function get_file_full_name(string $path) : string {
        return self::get_file_name($path) . self::get_ending_extension($path);
    }

    public static function get_file_name(string $path) : string {
        return pathinfo($path, PATHINFO_FILENAME);
    }

    public static function get_all_extensions(string $path) : ?array {
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

    public static function get_ending_extension(string $path) : string {
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
