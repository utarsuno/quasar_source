<?php

namespace CodeManager\Service\Manager;

use CodeManager\Command\Abstractions\PreparedCommand;
use CodeManager\Command\Prepared\DBSchemaUpdate;
use CodeManager\Command\Prepared\DBSchemaValidate;
use CodeManager\Service\Abstractions\BaseAbstractService;
use CodeManager\Service\Abstractions\OwnsCommands;
#use Psr\Log\LoggerInterface;
use Symfony\Component\Console\Application;


class CommandManagerService extends BaseAbstractService implements OwnsCommands {

    private const CMD_NAMES_TO_CLASSES = [
        PreparedCommand::CMD_DB_SCHEMA_UPDATE   => DBSchemaUpdate::class,
        PreparedCommand::CMD_DB_SCHEMA_VALIDATE => DBSchemaValidate::class
    ];

    /** @var array */
    private $commands = [];
    /** @var Application */
    private $kernel;

    public function set_application(Application $application): void {
        $this->kernel = $application;
    }

    public function get_command(string $command_name): PreparedCommand {
        if (!array_key_exists($command_name, $this->commands)) {
            $cmd_class                     = self::CMD_NAMES_TO_CLASSES[$command_name];
            $this->commands[$command_name] = new $cmd_class($this->kernel->find($command_name));
        }
        return $this->commands[$command_name];
    }

}
