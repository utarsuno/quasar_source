<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 21:56
 */

namespace CodeManager\Service;

use CodeManager\Entity\CodeManager\EntityCodeBuild;
use CodeManager\Entity\File\EntityFile;
use CodeManager\Repository\CodeManager\RepoCodeBuild;
use CodeManager\Repository\CodeManager\RepoFile;
use CodeManager\Service\Feature\AbstractService;
use CodeManager\Service\Feature\Repository\OwnsReposInterface;
use Doctrine\Common\Persistence\ObjectRepository;
use QuasarSource\BuildProcess\Abstractions\BuildSection;
use QuasarSource\QualityAssurance\ProjectTestSuiteResult;
use CodeManager\Service\Feature\Config\FeatureConfigUniversalInterface;
use CodeManager\Service\Feature\Config\FeatureConfigYAMLTrait;
use QuasarSource\Utilities\SystemOS\UtilsSystem  as SYS;
use CodeManager\Enum\ProjectParameterKeys\Path   as PATHS_ENUM;
use CodeManager\Enum\ProjectParameterKeys\Schema as SCHEMAS_ENUM;
use Symfony\Component\DependencyInjection\ContainerInterface; // <- Add this
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;


/**
 * @Service
 */
class CodeBuilderService extends AbstractService implements OwnsReposInterface, FeatureConfigUniversalInterface {
    use FeatureConfigYAMLTrait;

    /** @var ParameterBagInterface $configs_universal */
    private $configs_universal;

    /** @var RepoCodeBuild */
    private $repo_code_builds;

    /** @var EntityCodeBuild */
    private $current_code_build;

    #private $container;

    /** @var array */
    private $all_build_sections = [];

    /** @var DBService $service_db */
    private $service_db;

    /**
     * @var array < N O T E : the order will dictate order ran in >
     */
    private const BUILD_STEPS = [
        #CSSBuildSection::class,
        #HTMLBuildSection::class,
        #JSONBuildSection::class,
        #NPMLibBuildSection::class,
        #QAReportBuildSection::class
    ];

    /**
     * @param ContainerInterface    $container
     * @param ParameterBagInterface $bag
     * @param LoggerService         $logger_service
     * @param DBService             $service_db
     * @throws \Exception
     */
    public function __construct(ContainerInterface $container, ParameterBagInterface $bag, LoggerService $logger_service, DBService $service_db) {
        parent::__construct($logger_service);
        $this->configs_universal = $bag;
        $this->service_db        = $service_db;
        $this->config_yaml_load(
            $this->configs_universal->get(SCHEMAS_ENUM::YAML_CODE_MANAGER),
            SYS::get_env(PATHS_ENUM::PROJECT_CONFIG)
        );
        #var_dump('Early exit!');
        #exit();

        #$this->all_build_sections[] = $this->service_db_health;
        #foreach (self::BUILD_STEPS as $build_section_class) {
        #    $this->all_build_sections[] = new $build_section_class($this);
        #}
        $this->repo_code_builds = $this->service_db->get_repo(RepoCodeBuild::class);

        #$this->repo_code_builds->fetch_or_generate_last_build();
    }

    /**
     * @param  string $key
     * @return mixed
     */
    public function config_universal_get(string $key) {
        return $this->configs_universal->get($key);
    }

    public function get_test_hi(): string {
        return 'wow, it freaking works :o';
    }

    public function run_code_health_check(): void {
        var_dump('Running code health check!');

        #$this->current_code_build = $this->repo_code_builds->get_new_code_build();

        $build_step = $this->service_db->provide_build_step();
        $build_step->run();

        $db_snapshot = $this->service_db->get_db_snapshot();
        var_dump($db_snapshot);

        #$output = RUN::run_webpack_build();
        #var_dump($output);
        #exit();

        #$this->run_all_builds();
        #$this->print_final_results();
    }

    private function run_all_builds(): void {
        $previous_step_failed = false;
        # TODO: Add try-catch.
        /** @var BuildSection $build_section */
        foreach ($this->all_build_sections as $build_section) {
            # TODO: Check if the previous step failed or not.
        #    $build_section->run_unit_of_work();
        }
    }

    public function get_current_code_build(): EntityCodeBuild {
        return $this->current_code_build;
    }

    private function print_final_results(): void {
        $repo_entity_files = $this->get_repo(RepoFile::class);
        $all_db_files      = $repo_entity_files->get_all_entities();

        foreach ($all_db_files as $entity_file) {
            if (!$entity_file->hasParent()) {

                if ($entity_file->getType() === EntityFile::TYPE_HTML) {
                    var_dump($entity_file->getChild()->to_full_string($entity_file->get_child_recursively()));
                } else {
                    var_dump($entity_file->to_full_string($entity_file->get_child_recursively()));
                }
            }
        }

        $qa_results = new ProjectTestSuiteResult(SYS::get_env(PATHS_ENUM::QA_REPORT));
        var_dump($qa_results->get_qa_report());
    }

    // ----------------------------------------- I N T E R F A C E {OwnsRepos} -----------------------------------------

    /**
     * @param string $repo_key
     * @return ObjectRepository
     */
    public function get_repo(string $repo_key): ObjectRepository {
        return $this->service_db->get_repo($repo_key);
    }
}
