<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 02:48
 */

namespace QuasarSource\Utilities\Processes;


use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class ProcessUtilities {

    public static function run_process(array $command, bool $throw_error_on_exception, & $stdout, & $stderr) : void {
        $process = new Process($command);
        $process->setTimeout(20);
        $process->run();
        $process->wait();

        if ($throw_error_on_exception && !$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        $stdout = $process->getOutput();
        $stderr = $process->getErrorOutput();
    }

}