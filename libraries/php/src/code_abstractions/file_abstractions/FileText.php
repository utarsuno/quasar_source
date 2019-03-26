<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 13:47
 */

namespace QuasarSource\CodeAbstractions\File;

require_once '/quasar_source/libraries/php/autoload.php';


class FileText extends FileInstance {

    protected function load_contents() {
        return 'TODO!!!!!';
        #return Yaml::parseFile($this->get_full_path());
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
