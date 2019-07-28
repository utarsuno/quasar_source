<?php declare(strict_types=1);

namespace CodeManager\Service\Task;

use CodeManager\Repository\CodeManager\File\RepoDirectory;
use Exception;
use QuasarSource\CommonFeatures\TraitEnvironmentVariablesAsFields;
use QuasarSource\DataStructure\Factory\TraitFactoryBuildStep;

/**
 * Class Minification
 * @package CodeManager\Service\Task
 */
final class Minification {
    use TraitEnvironmentVariablesAsFields;
    use TraitFactoryBuildStep;

    private $env_log_file;

    /**
     * Minification constructor.
     * @param RepoDirectory $repo_directory
     */
    public function __construct(RepoDirectory $repo_directory) {
        $this->repo_directory = $repo_directory;
        $this->envs_set_as_str(['LOG_FILE' => 'env_log_file']);
    }

    /**
     * @throws Exception
     */
    public function build_step0_task_css(): void {
        var_dump('TASK 0: BUILD CSS');
        var_dump('Get assets from {' . $this->env_build_css . '}');

        $directory = $this->repo_directory->get_real($this->env_build_css);

        $files     = $directory->getFiles();

        foreach ($files as $file) {
            var_dump((string) $file);
        }

        // TODO: Sync directory lol

    }

}
