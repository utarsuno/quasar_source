<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-14
 * Time: 17:24
 */

namespace QuasarSource\Utilities\Processes;
use QuasarSource\Utilities\Files\FileUtilities as UFO;
use QuasarSource\Utilities\StringUtilities     as STR;


class ProcessNPMCommands extends ProcessUtilities {

    public static function get_latest_version(string $lib_name) : string {
        $p = new ProcessRunner([
            'npm',
            'view',
            $lib_name,
            'version'
        ]);
        $p->run();
        $p->throw_error_if_failed();
        return STR::remove_newline($p->get_output());
    }

    public static function get_version_local(string $lib_name) : string {
        $p = new ProcessRunner([
            'npm',
            'list',
            $lib_name,
            '--depth=0'
        ]);
        $p->run();
        $p->throw_error_if_failed();
        $output = $p->get_output();

        $lines = STR::split($output, PHP_EOL);
        foreach ($lines as $line) {
            if (STR::contains($line, $lib_name)) {
                $lib_version = trim(STR::indexed($line, STR::position_of_last_match($line, '@') + 1, strlen($line) - 1));
                return $lib_version;
            }
        }
        return $output;
    }

}
