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


class MinifyCSSCommand extends AbstractFileCommand {

    public const COMMAND_NAME = 'file_compression:minify:css';
    public const DESCRIPTION  = 'CSS Command Description';
    public const HELP         = 'CSS Command Full Description';

    protected function run_file_command(): int {
        UFO::minify_css($this->path_input, $this->path_output);
        return 0;
    }
}

