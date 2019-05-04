<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 16:16
 */

namespace QuasarSource\Utilities\Files;
use Exception;
use QuasarSource\Utilities\Processes\ProcessGZIP;
use QuasarSource\Utilities\Processes\ProcessMinifyCSS;
use QuasarSource\Utilities\Processes\ProcessMinifyHTML;
use Symfony\Component\Yaml\Yaml;
use QuasarSource\Utilities\Files\PathUtilities as UPO;


abstract class FileUtilities {

    private const HASH_ALGORITHM = 'sha512';

    public static function is_valid(string $path) : bool {
        return is_file($path);
    }

    /**
     * Return a boolean indicating if the file's sha512sum matches the provided one to check against.
     *
     * @param string $path      < The path to the file to get a sha512sum from. >
     * @param string $sha512sum < A provided hash value to check against.       >
     * @return bool             < True if matched.                              >
     * @throws Exception
     */
    public static function matches_sha512sum(string $path, string $sha512sum) : bool {
        UPO::is_valid($path, true);
        return hash_file(self::HASH_ALGORITHM, $path) === $sha512sum;
    }

    /**
     * Return the sha512sum of a file as a string hex number.
     *
     * @param string $path < The path to the file to get a hash value for. >
     * @return string      < Hex digits.                                   >
     * @throws Exception
     */
    public static function get_sha512sum(string $path) : string {
        UPO::is_valid($path, true);
        return hash_file(self::HASH_ALGORITHM, $path);
    }

    /**
     * Return the size (in bytes) of the file provided.
     *
     * @param string $path < The path to the file to get size of. >
     * @return int         < The number of bytes used by file.    >
     * @throws Exception
     */
    public static function get_size(string $path) : int {
        UPO::is_valid($path, true);
        return filesize($path);
    }

    /**
     * Take the contents of the provided CSS file and create a minified version at provided output path.
     *
     * @param string $path_base   < The path to the CSS file to get contents of. >
     * @param string $path_output < The path to create a minified CSS file at.   >
     * @throws Exception
     */
    public static function minify_css(string $path_base, string $path_output) : void {
        UPO::is_valid($path_base, true);
        ProcessMinifyCSS::minify_file_to($path_base, $path_output, true);
    }

    /**
     * Take the contents of the provided HTML file and create a minified version at provided output path.
     *
     * @param string $path_base   < The path to the CSS file to get contents of. >
     * @param string $path_output < The path to create a minified HTML file at.  >
     * @throws Exception
     */
    public static function minify_html(string $path_base, string $path_output) : void {
        UPO::is_valid($path_base, true);
        ProcessMinifyHTML::minify_file_to($path_base, $path_output, true);
    }

    /**
     * Take the contents of the provided file and create a gzipped version at provided output path.
     *
     * @param string $path_base   < The path to the file to get contents of. >
     * @param string $path_output < The path to create a gzipped file at.    >
     * @throws Exception
     */
    public static function gzip(string $path_base, string $path_output) : void {
        UPO::is_valid($path_base, true);
        ProcessGZIP::gzip_file_to($path_base, $path_output, true);
    }

    public static function delete(string $path) : void {
        if (UPO::is_valid($path)) {
            unlink($path);
        }
    }

    /**
     * Returns the contents of a YAML file as an association array.
     *
     * @param string $path < The path to the (yml/yaml) file to get contents of. >
     * @return array       < An association array of the file's contents.        >
     * @throws Exception
     */
    public static function get_yaml_contents(string $path) : array {
        UPO::is_valid($path, true);
        return Yaml::parseFile($path);
    }

    public static function file_op_set_contents(string $path, string $contents) : void {
        UPO::is_valid($path, true);
        file_put_contents($path, $contents, LOCK_EX);
    }

    public static function get_contents_as_list(string $path) : array {
        UPO::is_valid($path, true);
        $file_lines = [];
        $lines = file($path);
        foreach ($lines as $line) {
            $file_lines[] = $line;
        }
        return $file_lines;
    }

}

