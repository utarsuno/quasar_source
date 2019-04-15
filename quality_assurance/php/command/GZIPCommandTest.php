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


class GZIPCommandTest extends AbstractTestFileCommand {

    public function test_file_gzip() : void {
        $this->run_file_command(
            new GZIPCommand(),
            GZIPCommand::COMMAND_NAME,
            self::PATH_TEST_BASE . 'pre_gzipped.css',
            self::PATH_TEST_BASE . 'post_gzipped.css.gz'
        );
        $this->assert_minimum_required_compression_ratio(0.35);
    }

}


