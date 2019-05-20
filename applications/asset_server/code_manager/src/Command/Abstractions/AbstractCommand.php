<?php

namespace CodeManager\Command\Abstractions;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

abstract class AbstractCommand extends Command {

    public const COMMAND_NAME     = 'must_be_set_by_child_command_class';
    public const DESCRIPTION      = 'must_be_set_by_child_command_class';
    public const HELP             = 'must_be_set_by_child_command_class';

    /** @var InputInterface */
    protected $input;
    /** @var OutputInterface */
    protected $output;

    protected function configure(): void {
        $this->setName(self::COMMAND_NAME)
            ->setDescription(self::DESCRIPTION)
            ->setHelp(self::HELP);
        $this->add_required_arguments();
    }

    protected function execute(InputInterface $input, OutputInterface $output) {
        return $this->run_command();
    }

    abstract protected function add_required_arguments(): void;

    abstract protected function run_command();
}
