<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-14
 * Time: 20:59
 */

namespace CodeManager\Command;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Output\OutputInterface;


abstract class AbstractFileCommand extends Command {

    private const ARG_PATH_INPUT  = 'file_input';
    private const ARG_PATH_OUTPUT = 'file_output';

    protected $path_input;
    protected $path_output;
    private   $output_interface;

    protected function add_required_arguments() : void {
        $this
            ->addOption(
                self::ARG_PATH_INPUT,
                null,
                InputOption::VALUE_REQUIRED,
                'The file to be minified.'
            )
            ->addOption(
                self::ARG_PATH_OUTPUT,
                null,
                InputOption::VALUE_REQUIRED,
                'The output path for minified file.'
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output) {
        $this->output_interface = $output;
        $this->path_input       = $input->getOption(self::ARG_PATH_INPUT);
        $this->path_output      = $input->getOption(self::ARG_PATH_OUTPUT);
        return $this->run_file_command();
    }

    protected function l($output) : void {
        $this->output_interface->writeln($output);
    }

    abstract protected function run_file_command();

}