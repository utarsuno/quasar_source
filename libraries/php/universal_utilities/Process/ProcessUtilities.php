<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 02:48
 */

namespace QuasarSource\Utilities\Process;
use CodeManager\Enum\ProjectParameterKeys\Path;
use QuasarSource\Enums\EnumFileTypeExtensions as EXTENSION;
use QuasarSource\Utilities\StringUtilities    as STR;
use QuasarSource\Utilities\SystemUtilities    as SYS;

/**
 * Class ProcessUtilities
 * @package QuasarSource\Utilities\Process
 */
class ProcessUtilities {

    public static function run_cmd(array $command, ?string $cwd=null): string {
        $p = new ProcessRunner($command, true, 20, $cwd);
        $p->run();
        #var_dump($p->get_error_output());
        return $p->get_output();
    }

    public static function gzip_file_to(string $path_input, string $path_output): void {
        self::run_cmd(['gzip', '-f', '-k', '-9', $path_input]);
        $gzip_output_path = $path_input . EXTENSION::GZIPPED;
        if ($gzip_output_path !== $path_output) {
            rename($gzip_output_path, $path_output);
        }
    }

    // Q A.

    /**
     * @return string
     */
    public static function run_qa_tests(): string {
        #'--log-junit'
        # --log-teamcity
        return self::run_cmd(['php', 'bin/phpunit', '--log-junit', 'report.xml'], SYS::get_env(Path::DIRECTORY_CODE_MANAGER));
    }

    // C O M P O S E R.

    public static function run_composer_self_update(string $path_composer): string {
        return self::run_cmd(['php', $path_composer, 'self-update'], SYS::get_env(Path::DIRECTORY_CODE_MANAGER));
    }

    // W E B P A C K.

    public static function run_webpack_build(): string {
        return self::run_cmd(['npm', 'run-script', 'build'], SYS::get_env(Path::DIRECTORY_NODE));
    }

    // N O D E.

    public static function minify_file_html_to(string $path_input, string $path_output): string {
        return self::minify_file_to($path_input, $path_output, SYS::get_env(Path::RELATIVE_NODE_MINIFY_HTML));
    }

    public static function minify_file_css_to(string $path_input, string $path_output): string {
        return self::minify_file_to($path_input, $path_output, SYS::get_env(Path::RELATIVE_NODE_MINIFY_CSS));
    }

    private static function minify_file_to(string $path_input, string $path_output, string $minify_js_lib_file): string {
        return self::run_cmd(['node', $minify_js_lib_file, '-i', $path_input, '-o', $path_output]);
    }

    // N P M.

    public static function get_npm_lib_latest_version(string $lib_name): string {
        $output = self::run_cmd(['npm', 'view', $lib_name, 'version']);
        return STR::remove_newline($output);
    }

    public static function get_npm_lib_version_local(string $lib_name): string {
        $output = self::run_cmd(['npm', 'list', $lib_name, '--depth=0']);
        $lines  = STR::split($output, PHP_EOL);
        foreach ($lines as $line) {
            if (STR::has($line, $lib_name)) {
                # TODO: Create function to get sub_string after character
                $lib_version = trim(STR::indexed($line, STR::position_of_last_match($line, '@') + 1, strlen($line) - 1));
                return $lib_version;
            }
        }
        return $output;
    }

}