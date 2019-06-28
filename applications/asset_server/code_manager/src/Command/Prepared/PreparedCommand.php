<?php declare(strict_types=1);

namespace CodeManager\Command\Prepared;

use Exception;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;

/**
 * Class PreparedCommand
 * @package CodeManager\Command\Abstractions
 */
abstract class PreparedCommand {

    /** @var Command */
    private $cmd;
    /** @var BufferedOutput */
    private $output;
    /** @var ArrayInput */
    private $input;
    /** @var string */
    protected $results;
    /** @var int */
    protected $exit_code;

    /**
     * @param Command $command
     * @param array   $input
     */
    public function __construct(Command $command, array $input=[]) {
        $this->cmd    = $command;
        $this->output = new BufferedOutput();
        $this->input  = new ArrayInput($input);
    }

    /**
     * @throws Exception
     */
    public function run_command(): void {
        $this->exit_code = $this->cmd->run($this->input, $this->output);
        $this->results   = $this->output->fetch();
        $this->on_command_completed();
    }

    abstract protected function on_command_completed(): void;

}
