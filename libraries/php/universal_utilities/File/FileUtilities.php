<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 16:16
 */

namespace QuasarSource\Utilities\File;
use function is_array;
use Exception;
use QuasarSource\Utilities\Exception\ExceptionSystem;
use QuasarSource\Utilities\Exception\LogicException;
use QuasarSource\Utilities\Process\ProcessUtilities as RUN;
use QuasarSource\Utilities\CryptographyUtilities    as HASH;

/**
 * Class FileUtilities
 * @package QuasarSource\Utilities\File
 */
abstract class FileUtilities {

    /**
     * @param  string $path                   [The path to check for a valid file.                 ]
     * @param  bool   $raise_exception_if_not [If provided true, exception thrown on in-valid path.]
     * @return bool                           [True if a file actually exists at provided path.    ]
     */
    public static function is_valid(string $path, bool $raise_exception_if_not = true): bool {
        $is_path_valid = is_file($path);
        if ($raise_exception_if_not && !$is_path_valid) {
            throw LogicException::invalid_function_call('is_valid{file_path}', $path);
        }
        return $is_path_valid;
    }

    /**
     * @param  string $from
     * @param  string $to
     * @throws Exception
     */
    public static function copy(string $from, string $to): void {
        self::is_valid($from);
        if (!copy($from, $to)) {
            throw self::exception('copy', 'TODO: get dynamic error message');
        }
    }

    /**
     * Return a boolean indicating if the file's sha512sum matches the provided one to check against.
     *
     * @param string $path      [The path to the file to get a sha512sum from.]
     * @param string $sha512sum [A provided hash value to check against.      ]
     * @return bool             [True if matched.                             ]
     * @throws ExceptionSystem
     */
    public static function matches_sha512sum(string $path, string $sha512sum): bool {
        try {
            self::is_valid($path);
            return HASH::get_file_hash($path, HASH::SHA512SUM) === $sha512sum;
        } catch (Exception $e) {
            throw self::exception('matches_sha512sum', $e->getMessage());
        }
    }

    /**
     * Return the sha512sum of a file as a string hex number.
     *
     * @param string $path [The path to the file to get a hash value for.]
     * @return string      [Hex digits.                                  ]
     * @throws ExceptionSystem
     */
    public static function get_sha512sum(string $path): string {
        try {
            self::is_valid($path);
            return HASH::get_file_hash($path, HASH::SHA512SUM);
        } catch (Exception $e) {
            throw self::exception('get_sha512sum', $e->getMessage());
        }
    }

    /**
     * Return the size (in bytes) of the file provided.
     *
     * @param string $path [The path to the file to get size of.]
     * @return int         [The number of bytes used by file.   ]
     * @throws ExceptionSystem
     */
    public static function get_size(string $path): int {
        try {
            self::is_valid($path);
            return filesize($path);
        } catch (Exception $e) {
            throw self::exception('get_size', $e->getMessage());
        }
    }

    /**
     * Take the contents of the provided file and create a gzipped version at provided output path.
     *
     * @param string $path_base   [The path to the file to get contents of.]
     * @param string $path_output [The path to create a gzipped file at.   ]
     * @throws ExceptionSystem
     */
    public static function gzip(string $path_base, string $path_output): void {
        try {
            self::is_valid($path_base);
            RUN::gzip_file_to($path_base, $path_output);
        } catch (Exception $e) {
            throw self::exception('gzip', $e->getMessage());
        }
    }

    /**
     * @param string $path
     * @throws ExceptionSystem
     */
    public static function delete(string $path): void {
        try {
            if (self::is_valid($path)) {
                unlink($path);
            }
        } catch (Exception $e) {
            throw self::exception('delete', $e->getMessage());
        }
    }

    /**
     * @param  string $path
     * @param  mixed  $contents
     * @throws ExceptionSystem
     */
    public static function set(string $path, $contents): void {
        try {
            self::is_valid($path);
            #file_put_contents($path, $contents, LOCK_EX);
            $f = fopen($path, 'wb');
            if (is_array($contents)) {
                $contents = implode($contents);
            }
            fwrite($f, $contents);
            fclose($f);
        } catch (Exception $e) {
            throw self::exception('set', $e->getMessage());
        }
    }

    /**
     * @param string $path
     * @return array
     * @throws ExceptionSystem
     */
    public static function get(string $path): array {
        try {
            self::is_valid($path);
            $file_lines = [];
            $lines      = file($path);
            foreach ($lines as $line) {
                $file_lines[] = $line;
            }
            return $file_lines;
        } catch (Exception $e) {
            throw self::exception('get', $e->getMessage());
        }
    }

    /**
     * @param string $function_name
     * @param $data
     * @return ExceptionSystem
     */
    protected static function exception(string $function_name, $data): ExceptionSystem {
        return ExceptionSystem::file_exception($function_name, $data);
    }

}

