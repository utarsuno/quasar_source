<?php declare(strict_types=1);


namespace QuasarSource\Utilities\File;
use Exception;
use QuasarSource\Utilities\Exception\ExceptionDoesNotExist as DNE;
use QuasarSource\Utilities\UtilsString                 as STR;
use QuasarSource\Utilities\File\UtilsPath              as UPO;


/**
 * Class UtilsDirectory
 * @package QuasarSource\Utilities\File
 */
abstract class UtilsDirectory {

    /**
     * Does the path provided actually exist.
     * @param  string $path
     * @param  bool   $raise_exception_if_not
     * @return bool
     */
    public static function is_valid(string $path, bool $raise_exception_if_not = true): bool
    {
        $is_path_valid = is_dir($path);
        if ($raise_exception_if_not && !$is_path_valid) {
            throw DNE::exception('is_valid', 'path provided{' . $path . '} does not exist!');
        }
        return is_dir($path);
    }

    // TODO: Get sha512sum!

    public static function get_sha512sum(string $path_directory, bool $include_file_names_in_calculation, bool $use_recursion): string {

        return 'TODO!';
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
     * @throws Exception
     */
    public static function get_all_contents(string $path_directory, bool $use_recursion, array & $all_files, array & $all_directories): void {
        // TODO: Check if links should be checked + ignored.

        self::is_valid($path_directory);
        $files = scandir($path_directory, SCANDIR_SORT_NONE);
        if (!STR::ends_with($path_directory, DIRECTORY_SEPARATOR)) {
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

}
