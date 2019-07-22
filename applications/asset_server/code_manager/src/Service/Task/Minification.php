<?php declare(strict_types=1);

namespace CodeManager\Service\Task;

use CodeManager\Repository\CodeManager\File\RepoDirectory;
use QuasarSource\CommonFeatures\TraitEnvironmentVariablesAsFields;
use QuasarSource\DataStructure\Factory\TraitFactoryBuildStep;
use QuasarSource\Utils\File\UtilsFile;

/**
 * Class Minification
 * @package CodeManager\Service\Task
 */
final class Minification {
    use TraitEnvironmentVariablesAsFields;
    use TraitFactoryBuildStep;

    /** @var RepoDirectory $repo_directory */
    private $repo_directory;

    /** @var string $env_build_css */
    private $env_build_css;

    /** @var string $env_log_file */
    private $env_log_file;

    public function __construct(RepoDirectory $repo_directory) {
        $this->repo_directory = $repo_directory;
        $this->envs_set_as_str(['BUILD_CSS' => 'env_build_css', 'LOG_FILE' => 'env_log_file']);
    }

    public function build_step0_task_css(): void {
        var_dump('TASK 0: BUILD CSS');
        var_dump('Get assets from {' . $this->env_build_css . '}');

        $directory = $this->repo_directory->get_real($this->env_build_css);
        var_dump($directory);
    }

}
