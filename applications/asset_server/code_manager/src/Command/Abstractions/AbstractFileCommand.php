<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-14
 * Time: 20:59
 */

namespace CodeManager\Command\Abstractions;

use Symfony\Component\Console\Input\InputOption;


abstract class AbstractFileCommand extends AbstractCommand {

    private const ARG_PATH_INPUT  = 'file_input';
    private const ARG_PATH_OUTPUT = 'file_output';

    protected $path_input;
    protected $path_output;

    protected function add_required_arguments(): void {
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

    protected function run_command() {
        $this->path_input  = $this->input->getOption(self::ARG_PATH_INPUT);
        $this->path_output = $this->input->getOption(self::ARG_PATH_OUTPUT);
        return $this->run_file_command();
    }

    abstract protected function run_file_command();

}