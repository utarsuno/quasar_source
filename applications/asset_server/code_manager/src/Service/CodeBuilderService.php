<?php declare(strict_types=1);

namespace CodeManager\Service;

use CodeManager\Entity\CodeManager\EntityCodeBuild;
use CodeManager\Entity\CodeManager\EntityCodeProject;
use CodeManager\Entity\File\EntityDirectory;
use CodeManager\Entity\File\EntityFile;
use CodeManager\Entity\File\EntityFileType;
use CodeManager\Entity\Task\EntityMeeseeksTask;
use CodeManager\Repository\File\RepoDirectory;
use CodeManager\Repository\File\RepoFile;
use CodeManager\Repository\File\RepoFileType;
use CodeManager\Repository\CodeManager\RepoCodeBuild;
use CodeManager\Repository\CodeManager\RepoCodeProject;
use CodeManager\Repository\Task\RepoMeeseeksTask;
use CodeManager\Service\Feature\AbstractFactoryService;
use CodeManager\Service\Task\TaskAbstract;
use CodeManager\Service\Task\TaskBuildWebAssets;
use Doctrine\Common\Persistence\ObjectRepository;
use Exception;
use CodeManager\Service\Feature\Config\TraitConfigYAML;
use QuasarSource\Utils\DataType\UtilsArray     as ARY;
use QuasarSource\Utils\DataType\UtilsString    as STR;
use QuasarSource\Utils\DataType\UtilsTextLines as TEXT_LINES;
use QuasarSource\Utils\File\UtilsFile          as UFO;
use Throwable;

/**
 * @Service
 */
class CodeBuilderService extends AbstractFactoryService {
    use TraitConfigYAML;

    /** @var EntityCodeBuild */
    private $current_code_build;

    /** @var DBService $service_db */
    private $service_db;

    /** @var RepoCodeBuild $repo_code_build */
    private $repo_code_build;

    /**
     * @param  LoggerService         $logger_service
     * @param  DBService             $service_db
     * @throws Exception
     */
    public function __construct(LoggerService $logger_service, DBService $service_db) {
        parent::__construct($logger_service);
        $this->service_db = $service_db;
    }

    public function __destruct() {
        $this->destruct_trait_config_yaml();
    }

    /**
     * @return array
     * @throws Exception
     */
    public function get_report_volume(): array {
        var_dump('Getting report volume!');
        /** @var RepoDirectory $repo_dirs */
        $repo_dirs  = $this->get_repo(EntityDirectory::class);
        // TODO: Run this locally, see what the output is
        $volume_dir = $repo_dirs->get_real('/v/');
        $all_files  = $volume_dir->get_all_paths();
        $paths      = [];
        foreach ($all_files as $path) {
            $paths[] = $path;
        }
        return $paths;
    }

    /**
     * @throws Throwable
     */
    public function run_code_health_check(): void {
        // TODO: need to print ID of the CodeBuild entity that is being worked with. This will be very helpful for then
        // correctly matching up to the logs.
        $this->info('CodeBuild start!');

        UFO::copy('/quasar_source/var/nexus_local/nl.qs.html', '/v/nexus_local/nl_raw.html');
        var_dump(scandir('/v/nexus_local/'));



        exit();

        $this->service_db->run_build_step_n(0);

        /** @var RepoCodeProject $repo_projects */
        $repo_projects   = $this->get_repo(EntityCodeProject::class);
        $project         = $repo_projects->get_current_build_project();
        $tasks           = $repo_projects->get_project_procedures($project);

        /** @var TaskAbstract $task */
        foreach ($tasks as $task) {
            $task->run_task($project, $this);
        }

        /** @var RepoDirectory $repo_dir */
        #$repo_dir = $this->get_repo(EntityDirectory::class);
        #$project->cache_directories($repo_dir);
        #$path_volume = $project->getPathOutput();
        #var_dump($path_volume);
        #var_dump(scandir($path_volume));




        /*
        #$p = new ProcessRunner(['composer', 'dump-env', 'dev'], true, '/quasar_source/applications/asset_server/code_manager/', 20, false, ProcessRunner::OUTPUT_FORMAT_LINES_CLEAN);
        #$p->run();
        #var_dump($p->get_output());
        #var_dump($p->get_error_output());

        $contents = include '/quasar_source/applications/asset_server/code_manager/.env.local.php';
        var_dump($contents);
        $path_bootstrap = '/quasar_source/applications/asset_server/code_manager/config/bootstrap.php';
        $lines = UFO::get($path_bootstrap);
        var_dump($lines);
        $new_lines = CodeParserPHP::replace_array($lines, '_ENV', $contents);
        #var_dump($new_lines);
        UFO::set($path_bootstrap, $new_lines);
        return;

        #$p = new ProcessRunner(['php', '-v'], true, null, 20, false, ProcessRunner::OUTPUT_FORMAT_LINES_CLEAN);
        #var_dump($p->get_output());
        #exit();*/

        // Un-comment this line as a quick means to easily force update running schema update for DB.
        #$this->service_db->update_db_schema();

        #$this->service_db->run_build_step_n(0);
        $this->service_db->run_build_step_n(1);
        $this->service_db->run_build_step_n(2);
        $this->service_db->run_build_step_n(3);

        $this->run_build_step_n(0);
        $this->run_build_step_n(4);
        $this->run_build_step_n(5);

        /** @var RepoMeeseeksTask $repo_tasks */
        $repo_tasks = $this->service_db->get_repo(EntityMeeseeksTask::class);
        #$task       = $repo_tasks->create_new_task('Pay AT&T Internet Bill', 4);
        #$repo_tasks->save($task, true);

        $all_task_entities = $repo_tasks->get_all();
        $all_tasks         = [];
        /** @var EntityMeeseeksTask $entity_task */
        foreach ($all_task_entities as $entity_task) {
            $all_tasks[] = $entity_task->as_array();
        }
        $json_data = json_encode($all_tasks);
        #var_dump($json_data);
        #applications/asset_server/code_manager/public
        #UFO::set('/quasar_source/applications/asset_server/code_manager/public/data.json', $json_data, true);

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
        $this->repo_code_build    = $this->get_repo(EntityCodeBuild::class);
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

        #/** @var RepoDirectory $repo_directory */
        #$repo = $this->get_repo(EntityDirectory::class);
        #$min  = new Minification($repo);
        #$step = $min->generate_build_step('minification');
        #$step->run();
    }

    public function build_step4_css_build(): void {
        /** @var RepoDirectory $repo_directory */
        $repo_directory = $this->get_repo(EntityDirectory::class);
        /** @var RepoFileType $repo_file_type */
        $repo_file_type = $this->get_repo(EntityFileType::class);
        /** @var RepoFile $repo_file */
        $repo_file      = $this->get_repo(EntityFile::class);
        $min            = new TaskBuildWebAssets($repo_directory, $repo_file, $repo_file_type, $this->service_logger);
        $step           = $min->generate_build_step('minification');
        $step->run();
    }

    public function build_step5_save_code_build(): void {
        var_dump('Saving entity!');
        $this->repo_code_build->save($this->current_code_build, true);
        // TODO: Save anything needed here, perform flush.
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
