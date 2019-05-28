<?php

namespace CodeManager\Command\Abstractions;

use QuasarSource\Traits\TraitPatternName;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;


abstract class PreparedCommand {
    use TraitPatternName;

    public const CMD_DB_SCHEMA_UPDATE   = 'doctrine:schema:update';
    public const CMD_DB_SCHEMA_VALIDATE = 'doctrine:schema:validate';

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

    public function __construct(string $name, Command $command, array $input=[]) {
        $this->set_name($name);
        $this->cmd    = $command;
        $this->output = new BufferedOutput();
        $this->input  = new ArrayInput($input);
    }

    public function run_command(): void {
        $this->exit_code = $this->cmd->run($this->input, $this->output);
        $this->results   = $this->output->fetch();
        $this->on_command_completed();
    }

    abstract protected function on_command_completed(): void;

}
