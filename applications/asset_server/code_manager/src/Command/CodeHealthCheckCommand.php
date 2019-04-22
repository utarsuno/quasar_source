<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 21:46
 */

namespace CodeManager\Command;


use CodeManager\Service\CodeBuilderService;
use CodeManager\Service\EntityFileRepoService;
use QuasarSource\Utilities\FileUtilities;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CodeHealthCheckCommand extends Command {

    public const COMMAND_NAME     = 'code:health_check';
    protected static $defaultName = self::COMMAND_NAME;

    private $repo_files;
    private $code_builder;

    public function __construct(EntityFileRepoService $repo_files, CodeBuilderService $code_builder) {
        $this->repo_files   = $repo_files;
        $this->code_builder = $code_builder;

        $this->code_builder->set_service_repo_files($this->repo_files);
        parent::__construct();
    }

    protected function configure() : void {
        $this
            ->setDescription('Runs a code health check.')
            ->setHelp('Runs a health check across all files and settings for the all local code files in this project.');
    }

    protected function execute(InputInterface $input, OutputInterface $output) {
        echo 'TODO: RUN CODE HEALTH CHECK COMMAND!' . PHP_EOL;
        $this->code_builder->run_code_health_check();
        return 0;
    }

}
