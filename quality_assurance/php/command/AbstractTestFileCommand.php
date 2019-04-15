<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-29
 * Time: 21:56
 */

namespace QuasarSource\QualityAssurance;

use PHPUnit\Framework\TestCase;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;
use QuasarSource\Utilities\FileUtilities as UFO;

require_once '/quasar_source/libraries/php/autoload.php';


abstract class AbstractTestFileCommand extends FileTestSuite {

    protected const PATH_TEST_BASE = '/quasar_source/var/quality_assurance/';

    protected $path_base;
    protected $path_output;
    protected $size_original;
    protected $size_modified;

    protected function run_file_command($command, string $command_name, string $path_base, string $path_output) : void {
        $this->path_base   = $path_base;
        $this->path_output = $path_output;
        $application       = new Application();
        $application->add($command);
        $cmd               = $application->find($command_name);
        $command_tester    = new CommandTester($cmd);
        $command_tester->execute([
            'command'       => $command->getName(),
            '--file_input'  => $this->path_base,
            '--file_output' => $this->path_output
        ]);
        #$command_output = $command_tester->getDisplay(); #echo 'The command output was {' . $command_output . '}' . PHP_EOL;
        $this->size_original = (float) UFO::file_get_size($this->path_base);
        $this->size_modified = (float) UFO::file_get_size($this->path_output);
    }

    protected function assert_minimum_required_compression_ratio(float $compression_percentage) : void {
        $this->assertLessThan(1.0 - $compression_percentage, $this->size_modified / $this->size_original);
    }

}
