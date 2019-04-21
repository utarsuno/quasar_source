<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-27
 * Time: 22:21
 */

namespace CodeManager\Tests\Command;
use CodeManager\Command\GZIPCommand;
use QuasarSource\QualityAssurance\AbstractTestFileCommand;

class GZIPCommandTest extends AbstractTestFileCommand {

    protected $path_base     = self::PATH_TEST_BASE . 'pre_gzipped.css';
    protected $path_output   = self::PATH_TEST_BASE . 'post_gzipped.css.gz';
    protected $command_class = GZIPCommand::class;
    protected $command_name  = GZIPCommand::COMMAND_NAME;

    public function test_file_gzip_command() : void {
        $this->run_compression_assertion(0.35);
    }

}


