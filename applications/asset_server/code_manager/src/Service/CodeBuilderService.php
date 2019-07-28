<?php declare(strict_types=1);

namespace CodeManager\Service;

use CodeManager\Entity\CodeManager\EntityCodeBuild;
use CodeManager\Entity\CodeManager\File\EntityFile;
use CodeManager\Repository\CodeManager\File\RepoDirectory;
use CodeManager\Repository\CodeManager\File\RepoFile;
use CodeManager\Repository\CodeManager\File\RepoFileType;
use CodeManager\Repository\CodeManager\RepoCodeBuild;
use CodeManager\Service\Feature\AbstractFactoryService;
use CodeManager\Service\Task\Minification;
use CodeManager\Service\Task\TaskBuildWebAssets;
use Doctrine\Common\Persistence\ObjectRepository;
use Exception;
use QuasarSource\QualityAssurance\ProjectTestSuiteResult;
use CodeManager\Service\Feature\Config\InterfaceConfigUniversal;
use CodeManager\Service\Feature\Config\TraitConfigYAML;
use QuasarSource\Utils\DataType\UtilsArray     as ARY;
use QuasarSource\Utils\DataType\UtilsString    as STR;
use QuasarSource\Utils\DataType\UtilsTextLines as TEXT_LINES;
use QuasarSource\Utils\File\UtilsFile          as UFO;
use QuasarSource\Utils\SystemOS\UtilsSystem    as SYS;
use CodeManager\Enum\ProjectParameterKeys\Path     as PATHS_ENUM;
use CodeManager\Enum\ProjectParameterKeys\Schema   as SCHEMAS_ENUM;
use Symfony\Component\DependencyInjection\ContainerInterface; // <- Add this
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Throwable;

/**
 * @Service
 */
class CodeBuilderService extends AbstractFactoryService implements InterfaceConfigUniversal {
    use TraitConfigYAML;

    /** @var ParameterBagInterface $configs_universal */
    private $configs_universal;

    /** @var EntityCodeBuild */
    private $current_code_build;

    #private $container;

    /** @var DBService $service_db */
    private $service_db;

    /** @var RepoCodeBuild $repo_code_build */
    private $repo_code_build;

    /**
     * @param  ContainerInterface    $container
     * @param  ParameterBagInterface $bag
     * @param  LoggerService         $logger_service
     * @param  DBService             $service_db
     * @throws Exception
     */
    public function __construct(
        ContainerInterface    $container,
        ParameterBagInterface $bag,
        LoggerService         $logger_service,
        DBService             $service_db
    ) {
        parent::__construct($logger_service);
        $this->configs_universal = $bag;
        $this->service_db        = $service_db;
        $this->config_yaml_load(
            $this->configs_universal->get(SCHEMAS_ENUM::YAML_CODE_MANAGER),
            SYS::get_env(PATHS_ENUM::PROJECT_CONFIG)
        );
        #foreach (self::BUILD_STEPS as $build_section_class) {
        #    $this->all_build_sections[] = new $build_section_class($this);
        #}
    }

    #NPMLibBuildSection::class,
    #QAReportBuildSection::class

    public function __destruct() {
        $this->destruct_trait_config_yaml();
    }

    /**
     * @param  string $key
     * @return mixed
     */
    public function config_universal_get(string $key) {
        return $this->configs_universal->get($key);
    }

    /**
     * @throws Throwable
     */
    public function run_code_health_check(): void {
        // TODO: need to print ID of the CodeBuild entity that is being worked with. This will be very helpful for then
        // correctly matching up to the logs.
        $this->info('CodeBuild start!');

        // Un-comment this line as a quick means to easily force update running schema update for DB.
        #$this->service_db->update_db_schema();

        $this->service_db->run_build_step_n(0);
        $this->service_db->run_build_step_n(1);
        $this->service_db->run_build_step_n(2);
        $this->service_db->run_build_step_n(3);

        $this->run_build_step_n(0);
        $this->run_build_step_n(4);
        $this->run_build_step_n(5);

        #$next_step = $this->generate_build_step('Code Manager');
        #$next_step->run();

        #$db_snapshot = $this->service_db->get_db_snapshot();
        #var_dump($db_snapshot);

        #$output = RUN::run_webpack_build();
        #var_dump($output);
        #exit();

        #$this->run_all_builds();
        #$this->print_final_results();
    }

    public function build_step0_code_build_entity(): void {
        $this->repo_code_build    = $this->get_repo(RepoCodeBuild::class);
        $this->current_code_build = $this->repo_code_build->get_new_entity();
    }

    // TODO: Only run this step if the DB health check would otherwise be naturally skipped
    // If full build is being forced, then this step can be skipped.
    public function build_step1_log_file_checking(): void {
        return;

        // TODO:!!!!! THE FILE PROCESSING NEEDS TO BE DONE WITH A DIRECTORY AND FILE ENTITY PAIR!
        // The entity file should perform hash-sum comparions to see if the logs have changed.
        // But this step should only occur if the DB would naturally skip DB excess checks.
        // However! Measure the performance impact of the above, it might just be quicker to perform the DB checks anyway.

        $lines         = UFO::get_from_env_path('LOG_FILE');
        // TODO: create abstraction for getting the last section, even if it's
        $sections      = TEXT_LINES::parse_into_sections($lines, 'CodeBuild start!');
        $last_section  = ARY::get_last($sections);
        var_dump('There are {' . count($sections) . '} sections!');
        var_dump('LAST SECTION');
        #var_dump($last_section);

        $last_build_failed = false;
        $error_covered     = false;
        $flag_rebuild_db   = false;

        $num_lines = count($last_section);
        $last_line = $last_section[$num_lines - 1];
        if (STR::has($last_line, 'exited with code "1"')) {
            $last_build_failed = true;
            var_dump('EXITED WITH CODE 1!!!!!!!');

            // TODO: scan all lines for error, set code build flags as needed based off error messages. =)
            foreach ($last_section as $line) {

                if (STR::has($line, '] console.ERROR: Error thrown while running command')) {
                    if (STR::has($line, 'PDOException') && STR::has($line, 'Undefined column')) {
                        $error_covered = true;
                        $this->service_db->update_db_schema();
                    } else {
                        var_dump('NO MATCH FOUND!');
                        #var_dump($last_section);

                        exit();
                    }
                    break;
                }
            }
        }

    }

    public function build_step2_DB_Health_Checks(): void {
        return;
        $build_step = $this->service_db->generate_build_step('DB Health Check');
        $build_step->run();
    }

    /**
     * @throws Throwable
     */
    public function build_step3_Temporary_Testing(): void {
        return;
        // TODO: Use a DirectoryEntity to get the contents of the Docker volume!

        #$path_volume = SYS::get_env('EXTERNAL_VOLUME');
        #var_dump($path_volume);
        #var_dump(scandir($path_volume));

        /** @var RepoDirectory $repo_directory */
        $repo = $this->get_repo(RepoDirectory::class);
        $min  = new Minification($repo);
        $step = $min->generate_build_step('minification');
        $step->run();
    }

    public function build_step4_css_build(): void {
        /** @var RepoDirectory $repo_directory */
        $repo_directory  = $this->get_repo(RepoDirectory::class);
        /** @var RepoFileType $repo_file_type */
        $repo_file_type  = $this->get_repo(RepoFileType::class);
        /** @var RepoFile $repo_file */
        $repo_file       = $this->get_repo(RepoFile::class);
        $min             = new TaskBuildWebAssets($repo_directory, $repo_file, $repo_file_type);
        $step            = $min->generate_build_step('minification');
        $step->run();

        #$min_html        = #HTMLBuildSection
    }

    public function build_step5_save_code_build(): void {
        var_dump('Saving entity!');
        $this->repo_code_build->save_entity($this->current_code_build, true);
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

    /**
     * ----------------------------------------- I N T E R F A C E {OwnsRepos} -----------------------------------------
     * @param  string $repo_key
     * @return ObjectRepository
     */
    public function get_repo(string $repo_key): ObjectRepository {
        return $this->service_db->get_repo($repo_key);
    }
}
