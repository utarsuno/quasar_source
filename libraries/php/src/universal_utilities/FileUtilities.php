<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 16:16
 */

namespace QuasarSource\Utilities;
require_once '/quasar_source/libraries/php/autoload.php';
use QuasarSource\Utilities\StringUtilities as STR;


abstract class FileUtilities {

    private static function is_path_valid(string $path, bool $raise_exception_if_not=false) : bool {
        $is_path_valid = is_dir($path) || is_file($path);
        if ($raise_exception_if_not && !$is_path_valid) {
            ExceptionUtilities::throw_exception('Invalid path{' . $path . '}');
        }
        return $is_path_valid;
    }

    public static function get_all_paths_in_directory(string $path_directory, bool $use_recursion, array &$all_files, array &$all_directories) : void {
        self::is_path_valid($path_directory, true);
        // https://stackoverflow.com/questions/24783862/list-all-the-files-and-folders-in-a-directory-with-php-recursive-function
        $files = scandir($path_directory, SCANDIR_SORT_NONE);
        foreach ($files as $key => $value) {
            $path = realpath($path_directory . DIRECTORY_SEPARATOR . $value);
            if (!is_dir($path)) {
                $all_files[] = $path;
            } else if ($value !== '.' && $value !== '..') {
                if ($use_recursion) {
                    self::get_all_paths_in_directory($path, $use_recursion,$all_files, $all_directories);
                }
                $all_directories[] = $path;
            }
        }
    }

    public static function get_contents_as_list(string $path) : array {
        $file_lines = [];
        $lines = file($path);
        foreach ($lines as $line) {
            $file_lines[] = $line;
        }
        return $file_lines;
    }

    public static function path_get_directory(string $path) : string {
        return pathinfo($path, PATHINFO_DIRNAME) . '/';
    }

    public static function path_get_file_name(string $path) : string {
        return pathinfo($path, PATHINFO_FILENAME);
    }

    public static function path_get_ending_extension(string $path) : string {
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

