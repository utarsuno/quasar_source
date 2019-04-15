<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-27
 * Time: 22:21
 */

namespace QuasarSource\Command;
use QuasarSource\QualityAssurance\AbstractTestFileCommand;
require_once '/quasar_source/libraries/php/autoload.php';


class MinifyCSSCommandTest extends AbstractTestFileCommand {

    public function test_minify_css_command() : void {
        $this->run_file_command(
            new MinifyCSSCommand(),
            MinifyCSSCommand::COMMAND_NAME,
            self::PATH_TEST_BASE . 'pre_minified.css',
            self::PATH_TEST_BASE . 'post_minified.css'
        );
        $this->assert_minimum_required_compression_ratio(0.60);
    }

}
