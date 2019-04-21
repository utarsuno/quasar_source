<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-14
 * Time: 17:24
 */

namespace QuasarSource\Utilities\Processes;

class ProcessMinifyCSS extends ProcessUtilities {

    public static function minify_file_to(string $path_input, string $path_output, bool $throw_error_on_exception) : void {
        $p = new ProcessRunner([
            'node',
            '/quasar_source/applications/asset_server/js/minify_css_file.js',
            '-i',
            $path_input,
            '-o',
            $path_output
        ]);
        $p->run();
        if ($throw_error_on_exception) {
            $p->throw_error_if_failed();
        }
    }

}
