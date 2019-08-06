<?php declare(strict_types=1);

namespace CodeManager\Service\Task;

use CodeManager\Repository\File\RepoDirectory;
use CodeManager\Repository\File\RepoFile;
use CodeManager\Repository\File\RepoFileType;
use CodeManager\Service\LoggerService;
use QuasarSource\CommonFeatures\TraitEnvVarsAsFields;
use QuasarSource\DataStructure\Factory\TraitFactoryBuildStep;
use QuasarSource\Utils\Process\ProcessRunner;

/**
 * Class TaskBuildWebAssets
 * @package CodeManager\Service\Task
 */
final class TaskBuildWebAssets {
    # -------------------------------------------------- T R A I T S ---------------------------------------------------
    use TraitEnvVarsAsFields;
    use TraitFactoryBuildStep;
    # -------------------------------------------------- F I E L D S ---------------------------------------------------

    /** @var LoggerService $logger */
    private $logger;

    /** @var RepoDirectory $repo_directory */
    private $repo_directory;

    /** @var RepoFile $repo_file */
    private $repo_file;

    /** @var RepoFileType $repo_file_type */
    private $repo_file_type;

    /** @var string $default_web_manifest */
    private $default_web_manifest;

    private $env_path_output;
    private $env_path_node;
    private $env_path_node_libs;

    # --------------------------------------------------- M A G I C ----------------------------------------------------

    /**
     * @param RepoDirectory $repo_directory
     * @param RepoFile      $repo_file
     * @param RepoFileType  $repo_file_type
     * @param LoggerService $logger
     */
    public function __construct(RepoDirectory $repo_directory, RepoFile $repo_file, RepoFileType $repo_file_type, LoggerService $logger) {
        $this->repo_directory = $repo_directory;
        $this->repo_file      = $repo_file;
        $this->repo_file_type = $repo_file_type;
        $this->logger         = $logger;
        $this->envs_set_as_str([
            'PATH_DIRECTORY_NODE'         => 'env_path_node',
            'PATH_DIRECTORY_NODE_JS_LIBS' => 'env_path_node_libs'
        ]);
    }

    public function __destruct() {
        $this->trait_destruct_factory_build_step();
        unset($this->repo_file, $this->repo_file_type, $this->repo_directory,
            $this->env_build_css, $this->env_path_output, $this->env_node_file_minifier);
    }

    # -------------------------------------------------- P U B L I C ---------------------------------------------------

    public function build_step1_task_js(): void {
        $cmd = ProcessRunner::execute(['npm', 'run-script', 'build'], $this->env_path_node);
        var_dump($cmd->get_output());
        var_dump($cmd->get_error_output());
    }

    # ----------------------------------------------- P R O T E C T E D ------------------------------------------------

    # ------------------------------------------------- P R I V A T E --------------------------------------------------

}
