<?php declare(strict_types=1);

namespace CodeManager\Command\Prepared;
use QuasarSource\Utilities\UtilsString;
use Symfony\Component\Console\Command\Command;

/**
 * Class DBSchemaUpdate
 * @package CodeManager\Command\Prepared
 */
class DBSchemaUpdate extends PreparedCommand {

    /** @var bool */
    private $db_schema_was_updated = false;

    /**
     * @param Command $command
     */
    public function __construct(Command $command) {
        parent::__construct($command, [
            '-vvv'              => null,
            '--no-interaction'  => null,
            '--force'           => null
        ]);
    }

    protected function on_command_completed(): void {
        #var_dump($this->results);
        if (UtilsString::contains($this->results, 'Updating database schema')) {
            $this->db_schema_was_updated = true;
        }
    }

    public function did_db_schema_update(): bool {
        return $this->db_schema_was_updated;
    }
}
