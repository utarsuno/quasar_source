<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 13:47
 */

namespace QuasarSource\CodeAbstractions\File\Discrete\ConfigAndText;
use QuasarSource\Utilities\Files\FileUtilities as UFO;
use QuasarSource\CodeAbstractions\File\FileInstance;


class FileYAML extends FileInstance {

    protected function load_contents() : array {
        return UFO::get_yaml($this->get_path_full());
    }

}
