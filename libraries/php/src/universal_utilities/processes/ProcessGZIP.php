<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-14
 * Time: 17:24
 */

namespace QuasarSource\Utilities\Processes;


class ProcessGZIP extends ProcessUtilities {

    public static function gzip_file_to(string $path_input, string $path_output, bool $throw_error_on_exception) : void {
        $p = new ProcessRunner([
            'gzip',
            '-f',
            '-k',
            '-9',
            $path_input
        ]);
        $p->run();
        if ($throw_error_on_exception) {
            $p->throw_error_if_failed();
        }
        rename($path_input . '.gz', $path_output);
    }

}
