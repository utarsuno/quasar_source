<?php

namespace CodeManager\Command\Prepared;
use CodeManager\Command\Abstractions\PreparedCommand;
use Symfony\Component\Console\Command\Command;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;
use QuasarSource\Utilities\StringUtilities               as STR;


class DBSchemaValidate extends PreparedCommand {

    /** @var bool */
    private $is_healthy_mapping;
    /** @var bool */
    private $is_healthy_schema;

    public function __construct(Command $command) {
        parent::__construct(PreparedCommand::CMD_DB_SCHEMA_UPDATE, $command, []);
    }

    protected function on_command_completed(): void {
        #if ($this->exit_code !== 0) {
        #    DBG::throw_exception('DB Health CMD had non 0 exit code{' . $this->exit_code . '} with output {' . $this->results . '}');
        #}

        $output = STR::split_into_non_empty_lines($this->results);

        if (count($output) !== 6) {
            DBG::throw_exception('DB Check has invalid output<<' . json_encode($output) . '>>');
        }

        $this->is_healthy_mapping = STR::contains($output[2], '[OK]');
        $this->is_healthy_schema  = STR::contains($output[5], '[OK]');
    }

    public function is_healthy_schema(): bool {
        return $this->is_healthy_schema;
    }

    public function is_healthy_mapping(): bool {
        return $this->is_healthy_mapping;
    }
}
