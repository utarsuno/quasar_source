<?php

namespace CodeManager\Service\Abstractions;

use CodeManager\Command\Abstractions\PreparedCommand;

interface OwnsCommands {
    public function get_command(string $command_name): PreparedCommand;
}
