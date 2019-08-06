<?php declare(strict_types=1);

namespace QuasarSource\Utils\File;

use Exception;
use QuasarSource\Utils\DataType\UtilsArray             as ARY;
use QuasarSource\Utils\Exception\ExceptionDoesNotExist as DNE;
use QuasarSource\Utils\DataType\UtilsString            as STR;
use QuasarSource\Utils\File\UtilsFile                  as UFO;
use QuasarSource\Utils\Math\UtilsCryptography;

/**
 * Class UtilsDirectory
 * @package QuasarSource\Utils\File
 */
abstract class UtilsDirectory {

    /**
     * Does the path provided actually exist.
     *
     * @param  string $path
     * @param  bool   $raise_exception_if_not
     * @return bool
     */
    public static function is_valid(string $path, bool $raise_exception_if_not = true): bool {
        $valid = is_dir($path);
        if ($raise_exception_if_not && !$valid) {
            throw DNE::exception('is_valid', 'path provided{' . $path . '} does not exist!');
        }
        return $valid;
    }

    /**
     * @param  string $path
     * @return bool
     */
    public static function is_base_of_valid(string $path): bool {
        if (self::is_valid($path, false)) {
            return true;
        }
        return self::is_valid(self::get_base_path($path), false);
    }

    /**
     * @param  string $path
     * @return bool
     */
    public static function create_if_dne_but_base_exists(string $path): bool {
        if (self::is_base_of_valid($path)) {
            return self::create_recursively($path);
        }
        return false;
    }

    /**
     * @param  string $path
     * @return string
     */
    public static function get_base_path(string $path): string {
        $base_path          = '';
        $num_chars          = strlen($path);
        $num_matches_needed = 1;
        if (STR::starts_with($path, '/')) {
            ++$num_matches_needed;
        }
        for ($c = 0; $c < $num_chars; $c++) {
            $char       = $path[$c];
            $base_path .= $char;
            if ($char === '/') {
                --$num_matches_needed;
                if ($num_matches_needed === 0) {
                    return $base_path;
                }
            }
        }
        return $base_path;
    }

    /**
     * @see https://stackoverflow.com/questions/2303372/create-a-folder-if-it-doesnt-already-exist
     * @author phazei
     * Original code has been modified!
     *
     * @param  string $path
     * @return bool
     */
    public static function create_recursively(string $path): bool {
        if (is_dir($path)) {
            return true;
        }
        $prev_path = substr($path, 0, strrpos($path, '/', -2) + 1 );
        $return    = self::create_recursively($prev_path);
        return ($return && is_writable($prev_path)) ? mkdir($path) : false;
    }

    /**
     * @param  string $path_directory
     * @param  bool   $use_recursion
     * @return string
     * @throws Exception
     */
    public static function get_sha512sum(string $path_directory, bool $use_recursion): string {
        $files  = [];
        $dirs   = [];
        $paths  = [];
        self::get_all_contents($path_directory, $use_recursion, $files, $dirs);
        foreach ($dirs as $dir) {
            $paths[$dir] = $dir;
        }
        foreach ($files as $file) {
            $paths[$file] = UFO::get_sha512sum($file);
        }
        UFO::ref_sort_alphabetically_by_key($paths);
        return UtilsCryptography::sha512sum_of(ARY::associative_to_single_continuous_string($paths));
    }

    /**
     * Provided a string path to search and given two arrays, add all found file and directory paths respectively to those arrays.
     *
     * @Documentation: https://stackoverflow.com/questions/24783862/list-all-the-files-and-folders-in-a-directory-with-php-recursive-function
     *
     * @param  string $path_directory  [base directory to fetch all file and directory paths from ]
     * @param  bool   $use_recursion   [if true, any sub-directories will be recursively traversed]
     * @param  array  $all_files       [a referenced array to insert file paths into              ]
     * @param  array  $all_directories [a referenced array to insert directory paths into         ]
     * @throws Exception
     */
    public static function get_all_contents(string $path_directory, bool $use_recursion, array & $all_files, array & $all_directories): void {
        // TODO: Check if links should be checked + ignored.

        self::is_valid($path_directory);
        $files = scandir($path_directory, SCANDIR_SORT_NONE);
        if (!STR::ends_in($path_directory, DIRECTORY_SEPARATOR)) {
            $path_directory .= DIRECTORY_SEPARATOR;
        }
        foreach ($files as $key => $value) {
            if ($value !== '.' && $value !== '..') {
                $path = realpath($path_directory . $value);
                if (!is_dir($path)) {
                    $all_files[] = $path;
                } else {
                    $all_directories[] = $path;
                    if ($use_recursion) {
                        self::get_all_contents($path, $use_recursion,$all_files, $all_directories);
                    }
                }
            }
        }
    }

    /**
     * @param  string $path_directory
     * @param  bool   $use_recursion
     * @return array
     * @throws Exception
     */
    public static function get_all_paths(string $path_directory, bool $use_recursion): array {
        $all_files = [];
        $all_dirs  = [];
        self::get_all_contents($path_directory, $use_recursion, $all_files, $all_dirs);
        return ARY::combine($all_files, $all_dirs);
    }

}
