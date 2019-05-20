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
use CodeManager\Entity\EntityNPMLib;
use CodeManager\Entity\EntityQAReport;
use CodeManager\Entity\Users\EntityUser;
use CodeManager\Entity\Users\EntityUserRole;
use CodeManager\Repository\EntityDirectoryRepository;
use CodeManager\Repository\EntityFileRepository;
use CodeManager\Repository\EntityNPMLibRepository;
use CodeManager\Repository\EntityQAReportRepository;
use CodeManager\Repository\Users\EntityUserRepository;
use CodeManager\Repository\Users\EntityUserRoleRepository;
use CodeManager\Service\Abstractions\BaseAbstractService;
use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Psr\Log\LoggerInterface;
use QuasarSource\BuildProcess\CSSBuildSection;
use QuasarSource\BuildProcess\DBBuildSection;
use QuasarSource\BuildProcess\HTMLBuildSection;
use QuasarSource\BuildProcess\JSONBuildSection;
use QuasarSource\BuildProcess\NPMLibBuildSection;
use QuasarSource\BuildProcess\QAReportBuildSection;
use QuasarSource\QualityAssurance\ProjectTestSuiteResult;
use QuasarSource\Traits\TraitConfigParams;
use QuasarSource\Utilities\Exceptions\ExceptionInvalidConfigurationFile;
use QuasarSource\Utilities\Files\FileUtilities as UFO;
use QuasarSource\Utilities\Files\FileUtilities;
use QuasarSource\Utilities\Files\PathUtilities as PATH;


class CodeBuilderService extends BaseAbstractService {
    use TraitConfigParams;

    private const REPO_TO_ENTITY = [
        EntityFileRepository::class      => EntityFile::class,
        EntityDirectoryRepository::class => EntityDirectory::class,
        EntityQAReportRepository::class  => EntityQAReport::class,
        EntityNPMLibRepository::class    => EntityNPMLib::class,
        EntityUserRepository::class      => EntityUser::class,
        EntityUserRoleRepository::class  => EntityUserRole::class,
    ];

    private const BUILD_STEPS = [
        CSSBuildSection::class,
        HTMLBuildSection::class,
        JSONBuildSection::class,
        NPMLibBuildSection::class,
        QAReportBuildSection::class,
        DBBuildSection::class
    ];

    /** @var EntityManagerInterface */
    private $entity_manager;
    /** @var array */
    private $config;
    /** @var array */
    private $all_build_sections = [];
    /** @var array */
    private $entity_repos       = [];
    /** @var CodeHealthCheckCommand */
    private $cmd;

    /**
     * CodeBuilderService constructor.
     * @param LoggerInterface $logger
     * @param EntityManagerInterface $entity_manager
     * @throws ExceptionInvalidConfigurationFile
     * @throws Exception
     */
    public function __construct(LoggerInterface $logger, EntityManagerInterface $entity_manager) {
        parent::__construct($logger);
        $this->entity_manager             = $entity_manager;
        EntityFile::$code_manager_service = $this;
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

        foreach (self::BUILD_STEPS as $build_section_class) {
            $this->all_build_sections[] = new $build_section_class($this);
        }
    }

    public function get_cmd(): CodeHealthCheckCommand {
        return $this->cmd;
    }

    public function set_code_builder_command(CodeHealthCheckCommand $cmd): void {
        $this->cmd = $cmd;
    }

    public function run_code_health_check(): void {

        $path = '/quasar_source/var/data/orders.json';

        $content = FileUtilities::get_json_contents($path);


        var_dump($content);

        #$output = RUN::run_webpack_build();
        #var_dump($output);
        #exit();

        var_dump('Code Health Check disabled');
        #$this->run_all_builds();
        #$this->print_final_results();
    }

    private function run_all_builds(): void {
        foreach ($this->all_build_sections as $build_section) {
            $build_section->run_unit_of_work();
        }
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

    public function get_repo(string $repo_key) : ObjectRepository {
        if (!array_key_exists($repo_key, $this->entity_repos)) {
            $this->set_repo($repo_key, self::REPO_TO_ENTITY[$repo_key]);
        }
        return $this->entity_repos[$repo_key];
    }

    private function set_repo(string $repo_key, string $entity_class): void {
        $this->entity_repos[$repo_key] = $this->entity_manager->getRepository($entity_class);
    }

}

