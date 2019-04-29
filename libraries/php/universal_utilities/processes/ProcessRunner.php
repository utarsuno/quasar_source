<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 17:41
 */

namespace QuasarSource\Utilities\Processes;

use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class ProcessRunner {

    private $process;
    private $failed = false;

    public function __construct(array $command, int $timeout=20) {
        $this->process = new Process($command);
        $this->process->setTimeout($timeout);
    }

    public function run() : void {
        $this->process->run();
        $this->process->wait();
        $this->failed = !$this->process->isSuccessful();
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