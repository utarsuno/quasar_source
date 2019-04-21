<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-14
 * Time: 14:39
 */


namespace CodeManager\Command;

use QuasarSource\Utilities\FileUtilities as UFO;


class MinifyHTMLCommand extends AbstractFileCommand {

    public const COMMAND_NAME     = 'file_compression:minify:html';
    protected static $defaultName = self::COMMAND_NAME;

    protected function configure() : void {
        $this
            ->setDescription('HTML Minify Command Description.')
            ->setHelp('HTML Minify Command Full Description.');
        $this->add_required_arguments();
    }

    protected function run_file_command() : int {
        UFO::file_minify_html($this->path_input, $this->path_output);
        return 0;
    }
}







