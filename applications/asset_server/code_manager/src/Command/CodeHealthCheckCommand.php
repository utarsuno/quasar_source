<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 21:46
 */

namespace CodeManager\Command;

use CodeManager\Service\CodeBuilderService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;


class CodeHealthCheckCommand extends Command {

    public const COMMAND_NAME     = 'code:health_check';
    protected static $defaultName = self::COMMAND_NAME;

    /** @var CodeBuilderService */
    private $code_builder;

    public function __construct(CodeBuilderService $code_builder) {
        parent::__construct();
        $this->code_builder = $code_builder;
    }

    protected function configure(): void {
        $this
            ->setDescription('Runs a code health check.')
            ->setHelp('Runs a health check across all files and settings for the all local code files in this project.');
    }

    protected function execute(InputInterface $input, OutputInterface $output) {
        $this->code_builder->prepare_code_health_check($this->getApplication());
        $this->code_builder->run_code_health_check();

        #var_dump('TODO: run_composer_self_update');
        #$c = RUN::run_composer_self_update(PATH::get(PATH::COMPOSER));
        #var_dump($c);

        return 0;
    }
}
