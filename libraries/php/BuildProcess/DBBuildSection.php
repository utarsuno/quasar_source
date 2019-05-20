<?php

namespace QuasarSource\BuildProcess;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\BuildProcess\Abstractions\UnitOfWork;


class DBBuildSection extends UnitOfWork {

    public function __construct(CodeBuilderService $code_builder) {
        parent::__construct('DB Health Check', $code_builder);
    }

    protected function pre_work(): void {
    }

    protected function perform_work(): void {
        $cmd = $this->code_builder->get_cmd();

        $mapping_healthy = false;
        $schema_healthy  = false;

        $cmd->check_db_health($mapping_healthy, $schema_healthy);

        if (!$mapping_healthy) {
            $this->code_builder->log('Entity mapping is not healthy!');
        }
        if (!$schema_healthy) {
            $this->code_builder->log('Updating the DB Schema!');
            $result = $cmd->update_db_schema();
            var_dump($result);
        }
    }

    protected function post_work(): void {
    }
}

