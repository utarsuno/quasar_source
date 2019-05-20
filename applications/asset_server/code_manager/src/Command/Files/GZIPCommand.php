<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-14
 * Time: 14:39
 */

namespace CodeManager\Command\Files;

use CodeManager\Command\Abstractions\AbstractFileCommand;
use QuasarSource\Utilities\Files\FileUtilities as UFO;

class GZIPCommand extends AbstractFileCommand {

    public const COMMAND_NAME = 'file_compression:gzip';
    public const DESCRIPTION  = 'GZIP Command Description';
    public const HELP         = 'GZIP Command Full Description';

    protected function run_file_command() : int {
        UFO::gzip($this->path_input, $this->path_output);
        return 0;
    }
}


