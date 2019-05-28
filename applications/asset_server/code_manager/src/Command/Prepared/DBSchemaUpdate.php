<?php

namespace CodeManager\Command\Prepared;
use CodeManager\Command\Abstractions\PreparedCommand;
use QuasarSource\Utilities\StringUtilities;
use Symfony\Component\Console\Command\Command;


class DBSchemaUpdate extends PreparedCommand {

    /** @var bool */
    private $db_schema_was_updated = false;

    public function __construct(Command $command) {
        parent::__construct(PreparedCommand::CMD_DB_SCHEMA_UPDATE, $command, [
            '-vvv'              => null,
            '--no-interaction'  => null,
            '--force'           => null
        ]);
    }

    protected function on_command_completed(): void {
        #var_dump($this->results);
        if (StringUtilities::contains($this->results, 'Updating database schema')) {
            $this->db_schema_was_updated = true;
        }
    }

    public function did_db_schema_update(): bool {
        return $this->db_schema_was_updated;
    }
}
