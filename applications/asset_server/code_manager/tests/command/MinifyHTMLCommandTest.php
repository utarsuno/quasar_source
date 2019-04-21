<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-27
 * Time: 22:21
 */

namespace CodeManager\Tests\Command;
use CodeManager\Command\MinifyHTMLCommand;
use QuasarSource\QualityAssurance\AbstractTestFileCommand;


class MinifyHTMLCommandTest extends AbstractTestFileCommand {

    protected $path_base     = self::PATH_TEST_BASE . 'pre_minified.html';
    protected $path_output   = self::PATH_TEST_BASE . 'post_minified.html';
    protected $command_class = MinifyHTMLCommand::class;
    protected $command_name  = MinifyHTMLCommand::COMMAND_NAME;

    public function test_minify_html_command() : void {
        $this->run_compression_assertion(0.30);
    }

}
