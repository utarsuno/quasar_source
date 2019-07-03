<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 13:47
 */

namespace QuasarSource\CodeAbstractions\File\Discrete\ConfigAndText;
use QuasarSource\Utilities\File\Discrete\YAMLUtils as YAML;
use QuasarSource\CodeAbstractions\File\FileInstance;


class FileYAML extends FileInstance {

    protected function load_contents() : array {
        return YAML::get($this->get_path_full());
    }

}
