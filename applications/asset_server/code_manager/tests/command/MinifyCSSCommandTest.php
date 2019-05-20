<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-27
 * Time: 22:21
 */

namespace CodeManager\Tests\Command;
use CodeManager\Command\Files\MinifyCSSCommand;
use QuasarSource\QualityAssurance\AbstractTestFileCommand;


class MinifyCSSCommandTest extends AbstractTestFileCommand {

    protected $path_base     = self::PATH_TEST_BASE . 'pre_minified.css';
    protected $path_output   = self::PATH_TEST_BASE . 'post_minified.css';
    protected $command_class = MinifyCSSCommand::class;
    protected $command_name  = MinifyCSSCommand::COMMAND_NAME;

    public function test_minify_css_command(): void {
        $this->run_compression_assertion(0.60);
    }

}
