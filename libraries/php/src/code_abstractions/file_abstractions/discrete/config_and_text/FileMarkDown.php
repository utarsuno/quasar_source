<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 13:47
 */

namespace QuasarSource\CodeAbstractions\File\Discrete\ConfigAndText;
use QuasarSource\CodeAbstractions\File\FileInstance;
use QuasarSource\CodeAbstractions\File\FileInstanceNonModifiable;


class FileMarkDown extends FileInstanceNonModifiable {

    protected function load_contents() {
        return 'TODO!!!!!';
        #return Yaml::parseFile($this->get_full_path());
    }
}
