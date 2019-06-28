<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 17:41
 */

namespace QuasarSource\Utilities\Process;

use QuasarSource\Utilities\File\PathUtilities as PATH;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class ProcessRunner {

    private $failed = false;
    private $process;
    private $prior_cwd;
    private $cwd;
    private $raise_exception_on_error;

    public function __construct(array $command, bool $raise_exception_on_error=true, int $timeout=20, ?string $cwd=null) {
        if ($cwd !== null) {
            $this->prior_cwd = PATH::get_current_cwd();
            $this->cwd       = $cwd;
            PATH::set_current_cwd($this->cwd);
        }
        $this->process = new Process($command);
        $this->process->setTimeout($timeout);
        $this->raise_exception_on_error = $raise_exception_on_error;
    }

    public function run(): void {
        if ($this->cwd !== null && PATH::get_current_cwd() !== $this->cwd) {
            PATH::set_current_cwd($this->cwd);
        }
        $this->process->run();
        $this->process->wait();
        $this->failed = !$this->process->isSuccessful();
        if ($this->prior_cwd !== null && $this->cwd !== $this->prior_cwd) {
            PATH::set_current_cwd($this->prior_cwd);
            $this->cwd = $this->prior_cwd;
        }
        if ($this->raise_exception_on_error && $this->failed) {
            throw new ProcessFailedException($this->process);
        }
    }

    public function get_output() {
        return $this->process->getOutput();
    }

    public function get_error_output() {
        return $this->process->getErrorOutput();
    }

}