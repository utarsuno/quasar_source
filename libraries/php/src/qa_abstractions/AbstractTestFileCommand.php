<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-29
 * Time: 21:56
 */

namespace QuasarSource\QualityAssurance;

use Symfony\Component\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;
use QuasarSource\Utilities\FileUtilities as UFO;


abstract class AbstractTestFileCommand extends FileTestSuite {

    protected const PATH_TEST_BASE = '/quasar_source/applications/asset_server/code_manager/var/quality_assurance/';

    protected $path_base;
    protected $path_output;
    protected $size_original;
    protected $size_modified;
    protected $command_class;
    protected $command_name;

    protected function run_compression_assertion(float $minimum_allowed_compression_achieved) : void {
        $application    = new Application();
        $command        = new $this->command_class();
        $application->add($command);
        $cmd            = $application->find($this->command_name);
        $command_tester = new CommandTester($cmd);
        $command_tester->execute([
            'command'       => $command->getName(),
            '--file_input'  => $this->path_base,
            '--file_output' => $this->path_output
        ]);

        #$command_output = $command_tester->getDisplay(); #echo 'The command output was {' . $command_output . '}' . PHP_EOL;

        $this->size_original = (float) UFO::file_get_size($this->path_base);
        $this->size_modified = (float) UFO::file_get_size($this->path_output);

        // Assert desired minimum compression ratio.
        $this->assertLessThan(1.0 - $minimum_allowed_compression_achieved, $this->size_modified / $this->size_original);

        // Clean-up.
        UFO::file_delete($this->path_output);
    }
}
