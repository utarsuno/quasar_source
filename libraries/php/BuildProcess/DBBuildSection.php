<?php

namespace QuasarSource\BuildProcess;
use CodeManager\Command\Abstractions\PreparedCommand;
use CodeManager\Command\Prepared\DBSchemaUpdate;
use CodeManager\Command\Prepared\DBSchemaValidate;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\BuildProcess\Abstractions\UnitOfWork;
use Symfony\Component\Config\Definition\Exception\Exception;


class DBBuildSection extends UnitOfWork {

    /** @var DBSchemaUpdate */
    private $cmd_schema_update;
    /** @var DBSchemaValidate */
    private $cmd_schema_validate;

    public function __construct(CodeBuilderService $code_builder) {
        parent::__construct('DB Health Check', $code_builder);
        $this->cmd_schema_update   = $code_builder->get_command(PreparedCommand::CMD_DB_SCHEMA_UPDATE);
        $this->cmd_schema_validate = $code_builder->get_command(PreparedCommand::CMD_DB_SCHEMA_VALIDATE);
    }

    protected function perform_work(): void {
        $this->run_cmd_wrapped([$this, 'run_schema_validate']);
        if (!$this->cmd_schema_validate->is_healthy_mapping()) {
            $this->log('Entity mapping is not healthy!');
            $this->mark_as_failed();
        }
        if (!$this->cmd_schema_validate->is_healthy_schema()) {
            $this->log('Updating the DB Schema!');
            $this->run_cmd_wrapped([$this, 'run_schema_update']);

            if ($this->cmd_schema_update->did_db_schema_update()) {
                $this->code_builder->get_current_code_build()->setDbSchemaUpdated(true);
            }
        }
    }

    protected function pre_work(): void {}
    protected function post_work(): void {}

    private function run_schema_validate(): void {
        $this->cmd_schema_validate->run_command();
    }

    private function run_schema_update(): void {
        $this->cmd_schema_update->run_command();
    }

    private function run_cmd_wrapped(callable $cmd): void {
        try {
            $cmd();
        } catch (Exception $e) {
            $this->mark_as_failed();
            $this->log('Exception{' . $e->getMessage() . '}');
        }
    }

    private function log($contents): void {
        $this->code_builder->log($contents);
    }
}

