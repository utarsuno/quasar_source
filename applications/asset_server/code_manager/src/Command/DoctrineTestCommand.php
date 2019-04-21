<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-14
 * Time: 14:39
 */


namespace CodeManager\Command;


use CodeManager\Entity\EntityDirectory;
use CodeManager\Service\EntityFileRepoService;

class DoctrineTestCommand extends AbstractFileCommand {

    public const COMMAND_NAME     = 'file_compression:test';
    protected static $defaultName = self::COMMAND_NAME;

    private $repo;

    protected function configure() : void {
        $this
            ->setDescription('GZIP Commend Description')
            ->setHelp('GZIP Command Full Description');
        $this->add_required_arguments();
    }

    public function __construct(EntityFileRepoService $entity_directory) {
        $this->repo = $entity_directory;
        parent::__construct();
    }

    protected function run_file_command() : int {
        $this->l('RUN DOCTRINE TESTS HERE!');

        $this->repo->temp_run('/quasar_source/assets/css/nexus_local.css');

        #var_dump($this->repo);

        return 0;
    }
}


