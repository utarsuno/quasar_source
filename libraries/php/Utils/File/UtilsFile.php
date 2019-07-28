<?php declare(strict_types=1);

namespace QuasarSource\Utils\File;

use InvalidArgumentException;
use function is_array;
use Exception;
use QuasarSource\Utils\Exception\ExceptionSystem;
use QuasarSource\Utils\DataType\UtilsTextLines as TEXT_LINES;
use QuasarSource\Utils\Process\UtilsProcess    as RUN;
use QuasarSource\Utils\Math\UtilsCryptography  as HASH;
use QuasarSource\Utils\SystemOS\UtilsSystem    as SYS;
use QuasarSource\Utils\Process\UtilsProcess;

/**
 * Class UtilsFile
 * @package QuasarSource\Utils\File
 */
abstract class UtilsFile {

    /**
     * @param  string $path                   {path to check for a valid file                     }
     * @param  bool   $raise_exception_if_not {if provided true, exception thrown on in-valid path}
     * @return bool                           {true if a file actually exists at provided path    }
     */
    public static function is_valid(string $path, bool $raise_exception_if_not=true): bool {
        if ($raise_exception_if_not && !is_file($path)) {
            throw new InvalidArgumentException('FileDNE{' . $path . '}');
        }
        return true;
    }

    /**
     * @param  array $array
     * @return void
     */
    public static function ref_sort_alphabetically_by_key(array & $array): void {
        ksort($array);
    }

    /**
     * @param  string $path_base
     * @param  string $path_new
     * @return void
     */
    public static function rename(string $path_base, string $path_new): void {
        self::is_valid($path_base);
        if ($path_base !== $path_new) {
            rename($path_base, $path_new);
        }
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
     * Return the sha512sum of a file as a string hex number.
     *
     * @param  string $path [path to the file to get a hash value for]
     * @return string       [128 hex digits                          ]
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
     * @param  string $path [path to the file to get size of]
     * @return int          [number of bytes used by file   ]
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
     * @param  string $path_base   [path to the file to get contents of]
     * @param  string $path_output [path to create a gzipped file at   ]
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
     * @param  string $path
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
     * @param  string $path
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
     * @param  string $env_key
     * @return array
     */
    public static function get_from_env_path(string $env_key): array {
        return self::get(SYS::get_env($env_key));
    }

    /**
     * @param  string $path
     * @param  int    $num_lines
     * @return array
     */
    public static function get_last_n_lines(string $path, int $num_lines): array {
        self::is_valid($path);
        return TEXT_LINES::parse_string(UtilsProcess::run_cmd(['tail', '-' . $num_lines, $path]));
    }

    /**
     * @param  string $function_name
     * @param  $data
     * @return ExceptionSystem
     */
    protected static function exception(string $function_name, $data): ExceptionSystem {
        return ExceptionSystem::file_exception($function_name, $data);
    }

}

