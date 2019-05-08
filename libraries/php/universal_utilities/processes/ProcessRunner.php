<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 17:41
 */

namespace QuasarSource\Utilities\Processes;

use QuasarSource\Utilities\Files\PathUtilities as PATH;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class ProcessRunner {

    private $process;
    private $failed = false;

    public function __construct(array $command, int $timeout=20) {
        $this->process = new Process($command);
        $this->process->setTimeout($timeout);
    }

    public function run(string $current_working_directory=null) : void {
        if ($current_working_directory !== null) {
            var_dump($current_working_directory);
            PATH::cwd_push($current_working_directory);
        }
        $this->process->run();
        $this->process->wait();
        $this->failed = !$this->process->isSuccessful();
        if ($current_working_directory !== null) {
            PATH::cwd_pop();
        }
    }

    public function throw_error_if_failed() : void {
        if ($this->failed) {
            throw new ProcessFailedException($this->process);
        }
    }

    public function failed() : bool {
        return $this->failed;
    }

    public function get_output() {
        return $this->process->getOutput();
    }

    public function get_error_output() {
        return $this->process->getErrorOutput();
    }

}