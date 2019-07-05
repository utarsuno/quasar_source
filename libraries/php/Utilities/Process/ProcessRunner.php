<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 17:41
 */

namespace QuasarSource\Utilities\Process;

use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

/**
 * Class ProcessRunner
 * @package QuasarSource\Utilities\Process
 */
class ProcessRunner {

    private $failed = false;
    private $process;
    private $raise_exception_on_error;

    /**
     * @param array  $command
     * @param bool   $raise_exception_on_error
     * @param int    $timeout
     * @param string $cwd
     */
    public function __construct(array $command, bool $raise_exception_on_error=true, int $timeout=20, string $cwd=null) {
        #flush();
        $this->process                  = new Process($command, $cwd);
        $this->raise_exception_on_error = $raise_exception_on_error;
        $this->process->setTimeout($timeout);
    }

    public function run(): void {
        $this->process->run();
        $this->process->wait();
        $this->failed = !$this->process->isSuccessful();
        if ($this->raise_exception_on_error && $this->failed) {
            throw new ProcessFailedException($this->process);
        }
    }

    /**
     * @return array
     */
    public function get_output_and_error(): array {
        return [$this->get_output(), $this->get_error_output()];
    }

    /**
     * @return string|array
     */
    public function get_output() {
        return $this->process->getOutput();
    }

    /**
     * @return string|array
     */
    public function get_error_output() {
        return $this->process->getErrorOutput();
    }

}