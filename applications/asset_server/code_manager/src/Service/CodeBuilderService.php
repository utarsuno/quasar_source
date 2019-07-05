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
use CodeManager\Repository\CodeManager\EntityCodeBuildRepository;
use CodeManager\Repository\CodeManager\EntityFileRepository;
use CodeManager\Service\Feature\AbstractService;
use CodeManager\Service\Feature\Repository\OwnsReposInterface;
use Doctrine\Common\Persistence\ObjectRepository;
use QuasarSource\BuildProcess\Abstractions\BuildSection;
use QuasarSource\QualityAssurance\ProjectTestSuiteResult;
use CodeManager\Service\Feature\Config\FeatureConfigUniversalInterface;
use CodeManager\Service\Feature\Config\FeatureConfigYAMLTrait;
use QuasarSource\Utilities\File\UtilsPath    as PATH;
use QuasarSource\Utilities\File\UtilsPath;
use QuasarSource\Utilities\FTP\FTPInstance;
use QuasarSource\Utilities\Time\TimerSimple;
use QuasarSource\Utilities\SystemOS\UtilsSystem    as SYS;
use QuasarSource\Utilities\DataType\UtilsString as STR;
use QuasarSource\Utilities\File\UtilsFile    as UFO;
use QuasarSource\Enums\EnumFileTypeExtensions    as EXTENSION;
use CodeManager\Enum\ProjectParameterKeys\Path   as PATHS_ENUM;
use CodeManager\Enum\ProjectParameterKeys\Schema as SCHEMAS_ENUM;

use QuasarSource\BuildProcess\CSSBuildSection;
use QuasarSource\BuildProcess\HTMLBuildSection;
use QuasarSource\BuildProcess\JSONBuildSection;
use QuasarSource\BuildProcess\NPMLibBuildSection;
use QuasarSource\BuildProcess\QAReportBuildSection;

use Symfony\Component\DependencyInjection\ContainerInterface; // <- Add this

use QuasarSource\Finance\Binance\BinanceAccountAPI;
use QuasarSource\Finance\Binance\Enum\BinanceEnumPairsToTrack as COIN_RATIO;
use Symfony\Component\DependencyInjection\Exception\InvalidArgumentException;
use Symfony\Component\DependencyInjection\Exception\ServiceCircularReferenceException;
use Symfony\Component\DependencyInjection\Exception\ServiceNotFoundException;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;


/**
 * @Service
 */
class CodeBuilderService extends AbstractService implements OwnsReposInterface, FeatureConfigUniversalInterface {
    use FeatureConfigYAMLTrait;

    /** @var ParameterBagInterface $configs_universal */
    private $configs_universal;

    /** @var DBService */
    private $service_db_health;

    /** @var EntityCodeBuildRepository */
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


        $this->all_build_sections[] = $this->service_db_health;
        foreach (self::BUILD_STEPS as $build_section_class) {
            $this->all_build_sections[] = new $build_section_class($this);
        }
        $this->repo_code_builds = $this->service_db->get_repo(EntityCodeBuildRepository::class);


        #$this->repo_code_builds->fetch_or_generate_last_build();

        #var_dump($this->repo_code_builds);
        #exit();

        var_dump('Created code builder!');
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

    public function run_code_health_check(DBService $db_health_service): void {
        $this->service_db_health = $db_health_service;

        var_dump('Running code health check!');

        $schema_is_valid = $this->service_db->is_schema_valid();
        var_dump($schema_is_valid);


        #$last_datetime = $this->repo_code_builds->get_datetime_of_last_successful_build();
        #if ($last_datetime === null) {
        #    var_dump('TODO: Create new EntityCodeBuild object!');
        #}

        # TODO: Utilize this!
        #$this->current_code_build = new EntityCodeBuild();

        #$path = '/quasar_source/var/data/orders.json';
        #$content = JSONUtilities::get($path);
        #var_dump($content);

        #$output = RUN::run_webpack_build();
        #var_dump($output);
        #exit();

        #var_dump('Code Health Check disabled');
        $this->run_all_builds();
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
        $repo_entity_files = $this->get_repo(EntityFileRepository::class);
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
