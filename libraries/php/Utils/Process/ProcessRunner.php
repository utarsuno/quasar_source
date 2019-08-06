<?php declare(strict_types=1);

namespace QuasarSource\Utils\Process;

use RuntimeException;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;
use QuasarSource\Utils\DataType\UtilsString as STR;

/**
 * Class ProcessRunner
 * @package QuasarSource\Utils\Process
 */
class ProcessRunner {

    public const OUTPUT_FORMAT_RAW         = 0;
    public const OUTPUT_FORMAT_LINES       = 1;
    public const OUTPUT_FORMAT_LINES_CLEAN = 2;
    public const OUTPUT_FORMAT_JSON        = 3;

    /** @var array|string $parsed_output */
    private $parsed_output;

    /** @var array|string $parsed_errors */
    private $parsed_errors;

    /** @var Process $process */
    private $process;

    /** @var bool $raise_exception_on_error */
    private $raise_exception_on_error;

    /** @var bool $failed */
    private $failed  = false;

    /** @var bool $was_ran */
    private $was_ran = false;

    /** @var int $output_format */
    private $output_format;

    /** @var int $exit_code */
    private $exit_code;

    /** @var string $exit_code_meaning */
    private $exit_code_meaning;

    /** @var bool $uses_custom_exit_code */
    private $uses_custom_exit_code;

    /**
     * @param  string|array $cmd
     * @param  string|null  $cwd
     * @return ProcessRunner
     */
    public static function spawn($cmd, string $cwd=null): ProcessRunner {
        return new ProcessRunner($cmd, false, $cwd);
    }

    /**
     * @param  $cmd
     * @param  string|null $cwd
     * @param  bool        $raise_exception_on_error
     * @return ProcessRunner
     */
    public static function execute($cmd, string $cwd=null, bool $raise_exception_on_error=false): ProcessRunner {
        $p = new ProcessRunner($cmd, $raise_exception_on_error, $cwd);
        $p->run();
        return $p;
    }

    /**
     * @param  string|array $cmd
     * @param  string|null  $cwd
     * @return ProcessRunner
     */
    public static function execute_must_pass($cmd, string $cwd=null): ProcessRunner {
        $p = new ProcessRunner($cmd, true, $cwd);
        $p->run();
        $errors = $p->get_error_output();
        if ($errors !== '') {
            throw new RuntimeException('The cmd{' . json_encode($cmd) . '} had error {' . $errors . '}');
        }
        return $p;
    }

    /**
     * @param array|string $command
     * @param bool         $raise_exception_on_error
     * @param string       $cwd
     * @param int          $timeout
     * @param bool         $uses_custom_exit_code
     * @param int          $output_format
     */
    public function __construct(
        $command,
        bool   $raise_exception_on_error=true,
        string $cwd=null,
        int    $timeout=20,
        bool   $uses_custom_exit_code=false,
        int    $output_format=self::OUTPUT_FORMAT_RAW
    ) {
        #flush();
        $this->uses_custom_exit_code    = $uses_custom_exit_code;
        $this->output_format            = $output_format;
        $this->process                  = new Process(is_string($command) ? STR::get_words($command) : $command, $cwd);
        $this->raise_exception_on_error = $raise_exception_on_error;
        $this->process->setTimeout($timeout);
    }

    public function __destruct() {
        if ($this->process !== null) {
            $this->process->stop();
            $this->process->clearOutput();
            $this->process->clearErrorOutput();
        }
        unset(
            $this->process, $this->failed, $this->raise_exception_on_error, $this->exit_code, $this->exit_code_meaning,
            $this->parsed_output, $this->parsed_errors, $this->output_format
        );
    }

    public function run(): void {
        if ($this->was_ran) {
            throw new RuntimeException('ProcessRunner has already been ran!');
        }
        $this->process->run();
        $this->process->wait();
        $this->was_ran   = true;
        $this->failed    = !$this->process->isSuccessful();
        $this->exit_code = $this->process->getExitCode();
        if (!$this->uses_custom_exit_code) {
            $this->exit_code_meaning = $this->process->getExitCodeText();
        }
        if ($this->raise_exception_on_error && $this->failed) {
            throw new ProcessFailedException($this->process);
        }
    }

    /**
     * @return bool
     */
    public function was_successful(): bool {
        if (!$this->was_ran) {
            throw new RuntimeException('Can\'t call {was_successful} as the process was never ran');
        }
        return !$this->failed && $this->get_error_output() === '';
    }

    /**
     * @return array|false|string|null
     */
    public function get_output() {
        if (!$this->was_ran) {
            $this->run();
        }
        if ($this->parsed_output === null) {
            $this->parsed_output = $this->parse_output($this->process->getOutput());
        }
        return $this->parsed_output;
    }

    /**
     * @return array|string|null
     */
    public function get_error_output() {
        if (!$this->was_ran) {
            $this->run();
        }
        if ($this->parsed_errors === null) {
            $this->parsed_errors = $this->parse_output($this->process->getErrorOutput());
        }
        return $this->parsed_errors;
    }

    # ------------------------------------------------- P R I V A T E --------------------------------------------------

    /**
     * @param  string $output
     * @return array|false|string|null
     */
    private function parse_output(string $output) {
        switch ($this->output_format) {
            case self::OUTPUT_FORMAT_RAW:
                return $output;
            case self::OUTPUT_FORMAT_LINES:
                return $output === '' ? [] : STR::split($output);
            case self::OUTPUT_FORMAT_LINES_CLEAN:
                return $output === '' ? [] : STR::split_clean($output);
            case self::OUTPUT_FORMAT_JSON:
                return json_encode($output);
            default:
                throw new RuntimeException('Output format not defined.');
        }
    }

}