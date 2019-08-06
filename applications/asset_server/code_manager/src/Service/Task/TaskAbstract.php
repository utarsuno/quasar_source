<?php declare(strict_types=1);

namespace CodeManager\Service\Task;

use CodeManager\Entity\CodeManager\EntityCodeProject;
use CodeManager\Service\CodeBuilderService;
use CodeManager\Service\LoggerService;
use Exception;

/**
 * Class TaskAbstract
 * @package CodeManager\Service\Task
 */
abstract class TaskAbstract {
    # -------------------------------------------------- T R A I T S ---------------------------------------------------

    # -------------------------------------------------- F I E L D S ---------------------------------------------------

    /** @var LoggerService $logger */
    protected $logger;

    /** @var CodeBuilderService $code_builder */
    protected $code_builder;

    /** @var EntityCodeProject $project */
    protected $project;

    # --------------------------------------------------- M A G I C ----------------------------------------------------
    public function __destruct() {
        $this->logger       = null;
        $this->project      = null;
        $this->code_builder = null;
    }
    # -------------------------------------------------- P U B L I C ---------------------------------------------------

    /**
     * @param  EntityCodeProject  $project
     * @param  CodeBuilderService $code_builder
     * @throws Exception
     */
    public function run_task(EntityCodeProject $project, CodeBuilderService $code_builder): void {
        $this->logger       = $code_builder->service_get_logger();
        $this->project      = $project;
        $this->code_builder = $code_builder;
        $this->task_prepare();
        $this->task_execute();
    }

    # ----------------------------------------------- P R O T E C T E D ------------------------------------------------

    /**
     * @throws Exception
     */
    abstract protected function task_prepare(): void;

    /**
     * @throws Exception
     */
    abstract protected function task_execute(): void;

    # ------------------------------------------------- P R I V A T E --------------------------------------------------
}
