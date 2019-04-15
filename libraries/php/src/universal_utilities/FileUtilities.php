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

    private const CMD_MINIFY_CSS = ['node', '/quasar_source/applications/asset_server/js/minify_css_file.js'];

    /**
     * Checks if a provided path is both valid and that it points to something existing.
     *
     * @param string $path                   < The string content to verify as a valid, existing, path.       >
     * @param bool   $raise_exception_if_not < If the provided path is not valid then an exception is thrown. >
     * @return bool
     * @throws \Exception
     */
    private static function is_path_valid(string $path, bool $raise_exception_if_not=false) : bool {
        // N O T E : Ensure that file check is performed first as that condition is more likely.
        $is_path_valid = ($path !== '') && (is_file($path) || is_dir($path));
        if ($raise_exception_if_not && !$is_path_valid) {
            ExceptionUtilities::throw_exception('Invalid path{' . $path . '}');
        }
        return $is_path_valid;
    }

    /**
     * Provided a string path to search and given two arrays, add all found file and directory paths respectively to those arrays.
     *
     * @Documentation: https://stackoverflow.com/questions/24783862/list-all-the-files-and-folders-in-a-directory-with-php-recursive-function
     *
     * @param string $path_directory  < The base directory to fetch all file and directory paths from.     >
     * @param bool   $use_recursion   < If set to true, any sub-directories will be recursively traversed. >
     * @param array  $all_files       < A provided array to insert file paths into.                        >
     * @param array  $all_directories < A provided array to insert directory paths into.                   >
     * @throws \Exception
     */
    public static function directory_get_all_contents(string $path_directory, bool $use_recursion, array &$all_files, array &$all_directories) : void {
        self::is_path_valid($path_directory, true);
        $files = scandir($path_directory, SCANDIR_SORT_NONE);
        if (!STR::ends_with($path_directory, DIRECTORY_SEPARATOR)) {
            $path_directory .= DIRECTORY_SEPARATOR;
        }
        foreach ($files as $key => $value) {
            if ($value === '.' || $value === '..') {
                continue;
            }
            $path = realpath($path_directory . $value);
            if (!is_dir($path)) {
                $all_files[] = $path;
            } else {
                $all_directories[] = $path;
                if ($use_recursion) {
                    self::directory_get_all_contents($path, $use_recursion,$all_files, $all_directories);
                }
            }
        }
    }

    /**
     * Return the sha512sum of a file as a string hex number.
     *
     * @param string $path < The path to the file to get a hash value for. >
     * @return string      < Hex digits.                                   >
     * @throws \Exception
     */
    public static function file_get_sha512sum(string $path) : string {
        self::is_path_valid($path, true);
        return hash_file('sha512', $path);
    }

    /**
     * Return the size (in bytes) of the file provided.
     *
     * @param string $path < The path to the file to get size of. >
     * @return int         < The number of bytes used by file.    >
     * @throws \Exception
     */
    public static function file_get_size(string $path) : int {
        self::is_path_valid($path, true);
        return filesize($path);
    }

    public static function file_css_minify(string $path_base, string $path_output, & $stdout, & $stderr) : void {
        self::is_path_valid($path_base, true);
        ProcessUtilities::run_process(
            [self::CMD_MINIFY_CSS[0], self::CMD_MINIFY_CSS[1], $path_base, $path_output],
            true,
            $stdout,
            $stderr
        );
    }

    public static function file_op_set_contents(string $path, string $contents) : void {
        file_put_contents($path, $contents, LOCK_EX);
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

    public static function file_gzip(string $path_base, string $path_output) : void {
        self::is_path_valid($path_base);
        $stdout = '';
        $stderr = '';
        ProcessUtilities::run_process(
            ['gzip', '-f', '-k', '-9', $path_base],
            true,
            $stdout,
            $stderr
        );
        rename($path_base . '.gz', $path_output);
    }

}

