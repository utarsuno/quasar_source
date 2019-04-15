<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-14
 * Time: 14:39
 */


namespace QuasarSource\Command;

require_once '/quasar_source/libraries/php/autoload.php';
use QuasarSource\Utilities\FileUtilities as UFO;


class MinifyCSSCommand extends AbstractFileCommand {

    public const COMMAND_NAME     = 'minify:css';
    protected static $defaultName = self::COMMAND_NAME;

    protected function configure() : void {
        $this
            ->setDescription('Test Command Description.')
            ->setHelp('Test Command Full Description.');
        $this->add_required_arguments();
    }

    protected function run_file_command() : int {
        $stdout = null;
        $stderr = null;
        UFO::file_css_minify($this->path_input, $this->path_output, $stdout, $stderr);
        #$this->l('Process output{' . $stdout . '}');
        #$this->l('Process errors{' . $stderr . '}');
        return 0;
    }
}







