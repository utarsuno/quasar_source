<?php


namespace QuasarSource\Utilities\Files;

use Exception;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;
use QuasarSource\Utilities\StringUtilities               as STR;


abstract class PathUtilities {

    private const QS                 = '/quasar_source/';
    private static $cached_paths     = [null, null, null, null, null, null, null, null, null];
    public const PROJECT_BASE        = 0;
    public const PROJECT_CONFIG      = 1;
    public const ASSET_DIR           = 2;
    public const NODE_DIR            = 3;
    public const JS_MINIFY_HTML      = 4;
    public const JS_MINIFY_CSS       = 5;
    public const JS_MINIFY_JS        = 6;
    public const QA_REPORT           = 7;
    public const CODE_MANAGER        = 8;
    public const COMPOSER            = 9;
    public const TEST_PATH_UTILITIES = 10;

    private static function calculate_cached_path(int $key): ?string {
        switch ($key) {
            case static::PROJECT_BASE:
                return self::get_up_to_layer(__FILE__, self::QS);
            case static::PROJECT_CONFIG:
                return static::get(static::PROJECT_BASE) . 'configs/code_manager.yml';
            case static::ASSET_DIR:
                return static::get(static::PROJECT_BASE) . 'applications/asset_server/';
            case static::NODE_DIR:
                return static::get(static::ASSET_DIR) . 'js/';
            case static::JS_MINIFY_HTML:
                return static::get(static::NODE_DIR) . 'minify_html_file.js';
            case static::JS_MINIFY_CSS:
                return static::get(static::NODE_DIR) . 'minify_css_file.js';
            case static::JS_MINIFY_JS:
                return static::get(static::NODE_DIR) . 'minify_js_file.js';
            case static::CODE_MANAGER:
                return static::get(static::ASSET_DIR) . 'code_manager/';
            case static::COMPOSER:
                return static::get(static::CODE_MANAGER) . 'composer.phar';
            case static::QA_REPORT:
                return static::get(static::CODE_MANAGER) . 'report.xml';
            case static::TEST_PATH_UTILITIES:
                return static::get(static::CODE_MANAGER) . 'tests/universal_utilities/files/PathUtilitiesTest.php';
            default:
                return null;
        }
    }

    /**
     * Utility function to get various needed project paths.
     *
     * @param int $key Class constant mapping.
     * @return string The path value.
     */
    public static function get(int $key): string {
        if (!isset($cached_paths[$key])) {
            static::$cached_paths[$key] = static::calculate_cached_path($key);
        }
        return static::$cached_paths[$key];
    }

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

    public static function get_up_to_layer(string $path, string $layer) : string {
        return STR::indexed($path, 0, STR::position_of_last_match($path, $layer)) . $layer;
    }

    public static function get_current_cwd() : string {
        return getcwd();
    }

    public static function set_current_cwd(string $path) : void {
        chdir($path);
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
