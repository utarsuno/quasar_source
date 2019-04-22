<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 16:16
 */

namespace QuasarSource\Utilities;
use QuasarSource\Utilities\Processes\ProcessGZIP;
use QuasarSource\Utilities\Processes\ProcessMinifyCSS;
use QuasarSource\Utilities\Processes\ProcessMinifyHTML;
use QuasarSource\Utilities\StringUtilities as STR;
use Symfony\Component\Yaml\Yaml;


abstract class FileUtilities {

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

    /**
     * Take the contents of the provided CSS file and create a minified version at provided output path.
     *
     * @param string $path_base   < The path to the CSS file to get contents of. >
     * @param string $path_output < The path to create a minified CSS file at.   >
     * @throws \Exception
     */
    public static function file_minify_css(string $path_base, string $path_output) : void {
        self::is_path_valid($path_base, true);
        ProcessMinifyCSS::minify_file_to($path_base, $path_output, true);
    }

    /**
     * Take the contents of the provided HTML file and create a minified version at provided output path.
     *
     * @param string $path_base   < The path to the CSS file to get contents of. >
     * @param string $path_output < The path to create a minified HTML file at.  >
     * @throws \Exception
     */
    public static function file_minify_html(string $path_base, string $path_output) : void {
        self::is_path_valid($path_base, true);
        ProcessMinifyHTML::minify_file_to($path_base, $path_output, true);
    }

    /**
     * Take the contents of the provided file and create a gzipped version at provided output path.
     *
     * @param string $path_base   < The path to the file to get contents of. >
     * @param string $path_output < The path to create a gzipped file at.    >
     * @throws \Exception
     */
    public static function file_gzip(string $path_base, string $path_output) : void {
        self::is_path_valid($path_base, true);
        ProcessGZIP::gzip_file_to($path_base, $path_output, true);
    }

    public static function file_delete(string $path) : void {
        if (self::is_path_valid($path)) {
            unlink($path);
        }
    }

    /**
     * Returns the contents of a YAML file as an association array.
     *
     * @param string $path < The path to the (yml/yaml) file to get contents of. >
     * @return array       < An association array of the file's contents.        >
     * @throws \Exception
     */
    public static function file_get_yaml_contents(string $path) : array {
        self::is_path_valid($path, true);
        return Yaml::parseFile($path);
    }

    public static function file_op_set_contents(string $path, string $contents) : void {
        self::is_path_valid($path, true);
        file_put_contents($path, $contents, LOCK_EX);
    }

    public static function get_contents_as_list(string $path) : array {
        self::is_path_valid($path, true);
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

