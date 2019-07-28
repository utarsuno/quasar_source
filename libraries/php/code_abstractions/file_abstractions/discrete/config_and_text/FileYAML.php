<?php declare(strict_types=1);

namespace QuasarSource\CodeAbstractions\File\Discrete\ConfigAndText;

use QuasarSource\Utils\File\Discrete\UtilsYAML as YAML;
use QuasarSource\CodeAbstractions\File\FileInstance;

class FileYAML extends FileInstance {

    protected function load_contents() : array {
        return YAML::get($this->get_path_full());
    }

}
