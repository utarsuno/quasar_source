<?php declare(strict_types=1);

namespace CodeManager\Service\Task;

use Exception;
use QuasarSource\CommonFeatures\TraitEnvVarsAsFields;
use QuasarSource\Utils\Process\ProcessRunner;

/**
 * Class TaskSyncCSS
 * @package CodeManager\Service\Task
 */
final class TaskSyncJS extends TaskFile {
    # -------------------------------------------------- T R A I T S ---------------------------------------------------
    use TraitEnvVarsAsFields;
    # -------------------------------------------------- F I E L D S ---------------------------------------------------
    /** @var string $env_path_node */
    protected $env_path_node;
    # --------------------------------------------------- M A G I C ----------------------------------------------------
    # -------------------------------------------------- P U B L I C ---------------------------------------------------

    protected function task_prepare(): void {
        parent::task_prepare();
        $this->env_set_as_str('PATH_DIRECTORY_NODE', 'env_path_node');
    }

    /**
     * @throws Exception
     */
    protected function task_execute(): void {
        $cmd    = ProcessRunner::execute_must_pass(['npm', 'run-script', 'build'], $this->env_path_node);
        $output = $cmd->get_output();
    }

    # ----------------------------------------------- P R O T E C T E D ------------------------------------------------
    # ------------------------------------------------- P R I V A T E --------------------------------------------------
}
