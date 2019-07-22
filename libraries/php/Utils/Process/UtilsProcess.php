<?php declare(strict_types=1);

namespace QuasarSource\Utils\Process;

use CodeManager\Enum\ProjectParameterKeys\Path;
use QuasarSource\Utils\File\Enum\EnumFileTypeExtensions   as EXTENSION;
use QuasarSource\Utils\File\UtilsFile       as UFO;
use QuasarSource\Utils\DataType\UtilsString as STR;
use QuasarSource\Utils\SystemOS\UtilsSystem as SYS;

/**
 * Class UtilsProcess
 * @package QuasarSource\Utils\Process
 */
abstract class UtilsProcess {

    /**
     * @param array $command
     * @param string $cwd
     * @param bool $raise_exception_on_error
     * @param bool $pretty_output
     * @return array
     */
    public static function run_process(
        array  $command,
        string $cwd=null,
        bool   $raise_exception_on_error=true,
        bool   $pretty_output=false
    ): array {
        flush();
        #ob_clean();
        $p = new ProcessRunner($command, $raise_exception_on_error, 20, $cwd);
        $p->run();
        if (!$pretty_output) {
            return [$p->get_output(), $p->get_error_output()];
        }
        $output = $p->get_output();
        $errors = $p->get_error_output();
        $output = STR::split_clean($output);
        $errors = STR::split_clean($errors);
        return [$output, $errors];
    }

    public static function run_cmd(array $command, string $cwd=null): string {
        $p = new ProcessRunner($command, true, 20, $cwd);
        $p->run();
        #var_dump($p->get_error_output());
        return $p->get_output();
    }

    /**
     * @param  string $path_input
     * @param  string $path_output
     * @return void
     */
    public static function gzip_file_to(string $path_input, string $path_output): void {
        self::run_cmd(['gzip', '-f', '-k', '-9', $path_input]);
        UFO::rename($path_input . EXTENSION::GZIPPED, $path_output);
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
                $lib_version = trim(STR::indexed($line, STR::position_of($line, '@', false) + 1, strlen($line) - 1));
                return $lib_version;
            }
        }
        return $output;
    }

}