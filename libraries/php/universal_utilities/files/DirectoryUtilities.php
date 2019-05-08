<?php


namespace QuasarSource\Utilities\Files;
use Exception;
use QuasarSource\Utilities\StringUtilities as STR;
use QuasarSource\Utilities\Files\PathUtilities as UPO;


abstract class DirectoryUtilities {

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
    public static function get_all_contents(string $path_directory, bool $use_recursion, array & $all_files, array & $all_directories) : void {
        UPO::is_valid($path_directory, true);
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
                    self::get_all_contents($path, $use_recursion,$all_files, $all_directories);
                }
            }
        }
    }

}
