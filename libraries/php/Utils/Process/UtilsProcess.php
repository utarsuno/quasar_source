<?php declare(strict_types=1);

namespace QuasarSource\Utils\Process;

use QuasarSource\Utils\DataType\UtilsString as STR;
use QuasarSource\Utils\SystemOS\UtilsSystem as SYS;

/**
 * Class UtilsProcess
 * @package QuasarSource\Utils\Process
 */
abstract class UtilsProcess {

    /**
     * @param  string|array $command
     * @param  string|null  $cwd
     * @return string
     */
    public static function run_cmd($command, string $cwd=null): string {
        $p = new ProcessRunner($command, true, $cwd, 20);
        $p->run();
        #var_dump($p->get_error_output());
        return $p->get_output();
    }

    // Q A.

    /**
     * @return string
     */
    public static function run_qa_tests(): string {
        #'--log-junit'
        # --log-teamcity
        return self::run_cmd(['php', 'bin/phpunit', '--log-junit', 'report.xml'], SYS::get_env('PATH_DIRECTORY_CODE_MANAGER'));
    }

    // C O M P O S E R.

    public static function run_composer_self_update(string $path_composer): string {
        return self::run_cmd(['php', $path_composer, 'self-update'], SYS::get_env('PATH_DIRECTORY_CODE_MANAGER'));
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