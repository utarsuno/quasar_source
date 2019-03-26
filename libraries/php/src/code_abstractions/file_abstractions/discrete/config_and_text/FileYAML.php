<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 13:47
 */

namespace QuasarSource\CodeAbstractions\File\Discrete\ConfigAndText;
use Symfony\Component\Yaml\Yaml;
use QuasarSource\CodeAbstractions\File\FileInstance;

require_once '/quasar_source/libraries/php/autoload.php';


class FileYAML extends FileInstance {

    protected function load_contents() {
        return Yaml::parseFile($this->get_path_full());
    }

    public function clean(): void
    {
        // TODO: Implement clean() method.
    }

    public function is_cleanable(): bool
    {
        // TODO: Implement is_cleanable() method.
    }

    public function is_clean(): ?bool
    {
        // TODO: Implement is_clean() method.
    }
}
