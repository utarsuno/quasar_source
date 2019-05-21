<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 21:56
 */

namespace CodeManager\Service;

use CodeManager\Command\CodeHealthCheckCommand;
use CodeManager\Entity\EntityDirectory;
use CodeManager\Entity\EntityFile;
use CodeManager\Repository\EntityFileRepository;
use CodeManager\Service\Abstractions\BaseAbstractService;
use CodeManager\Service\Abstractions\OwnsManagers;
use CodeManager\Service\Manager\BuildStepManagerService;
use CodeManager\Service\Manager\ManagerService;
use CodeManager\Service\Manager\RepositoryManagerService;
use Doctrine\Common\Persistence\ObjectRepository;
use Exception;
use CodeManager\Service\Abstractions\OwnsRepos;
use Psr\Log\LoggerInterface;
use QuasarSource\QualityAssurance\ProjectTestSuiteResult;
use QuasarSource\Traits\TraitConfigParams;
use QuasarSource\Utilities\Exceptions\ExceptionInvalidConfigurationFile;
use QuasarSource\Utilities\Files\FileUtilities        as UFO;
use QuasarSource\Utilities\Files\PathUtilities        as PATH;
use QuasarSource\Utilities\Processes\ProcessUtilities as RUN;


class CodeBuilderService extends BaseAbstractService implements OwnsRepos, OwnsManagers {
    use TraitConfigParams;

    public static $SINGLETON;

    /** @var CodeHealthCheckCommand */
    private $cmd;
    /** @var RepositoryManagerService */
    private $manager_repo;
    /** @var BuildStepManagerService */
    private $manager_build_step;
    /** @var ManagerService */
    private $manager_service;

    /**
     * CodeBuilderService constructor.
     *
     * @param  LoggerInterface                   $logger
     * @param  ManagerService                    $manager_service
     * @throws ExceptionInvalidConfigurationFile
     */
    public function __construct(LoggerInterface $logger, ManagerService $manager_service) {
        parent::__construct($logger);
        self::$SINGLETON          = $this;
        $this->manager_service    = $manager_service;
        $this->manager_repo       = $this->get_manager(RepositoryManagerService::class);
        $this->manager_build_step = $this->get_manager(BuildStepManagerService::class);
        $this->config_initialize(
            [
                'global_information' => null,
                'assets'             => [
                    UFO::EXTENSION_CSS             => null,
                    UFO::EXTENSION_HTML            => null,
                    UFO::EXTENSION_JSON            => null,
                    UFO::EXTENSION_SHADER_VERTEX   => null,
                    UFO::EXTENSION_SHADER_FRAGMENT => null
                ],
                'npm'                => null,
                'qa_report'          => null,
                'docker'             => null,
                'projects'           => null
            ],
            UFO::get_yaml_contents(PATH::get(PATH::PROJECT_CONFIG))
        );
        $this->manager_build_step->initialize_builds();
    }

    public function get_test_hi(): string {
        return 'wow, it freaking works :o';
    }

    public function get_cmd(): CodeHealthCheckCommand {
        return $this->cmd;
    }

    public function set_code_builder_command(CodeHealthCheckCommand $cmd): void {
        $this->cmd = $cmd;
    }

    public function run_code_health_check(): void {

        #$path = '/quasar_source/var/data/orders.json';
        #$content = FileUtilities::get_json_contents($path);
        #var_dump($content);

        #$output = RUN::run_webpack_build();
        #var_dump($output);
        #exit();

        var_dump('Code Health Check disabled');
        $this->manager_build_step->run_all_builds();
        $this->print_final_results();
    }

    private function print_final_results(): void {
        $repo_entity_files = $this->get_repo(EntityFileRepository::class);
        $all_db_files      = $repo_entity_files->get_all_entities();

        foreach ($all_db_files as $entity_file) {
            if (!$entity_file->hasParent()) {

                if ($entity_file->getFileType() === EntityFile::TYPE_HTML) {
                    var_dump($entity_file->getChild()->to_full_string($entity_file->get_child_recursively()));
                } else {
                    var_dump($entity_file->to_full_string($entity_file->get_child_recursively()));
                }
            }
        }

        $qa_results = new ProjectTestSuiteResult(PATH::get(PATH::QA_REPORT));
        var_dump($qa_results->get_qa_report());
    }

    // ------------------------- I N T E R F A C E {OwnsManagers} -------------------------

    public function get_manager(string $manager_class): BaseAbstractService {
        return $this->manager_service->get_manager($manager_class);
    }

    // --------------------------- I N T E R F A C E {OwnsRepos} ---------------------------

    public function get_repo(string $repo_key): ObjectRepository {
        return $this->manager_repo->get_repo($repo_key);
    }
}
