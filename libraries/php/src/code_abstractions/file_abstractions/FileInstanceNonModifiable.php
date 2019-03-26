<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 13:45
 */

namespace QuasarSource\CodeAbstractions\File;
use QuasarSource\CodeAbstractions\FileAbstraction;
require_once '/quasar_source/libraries/php/autoload.php';


abstract class FileInstanceNonModifiable extends FileInstance {

    public function __construct(string $name, string $extension, FileAbstraction $parent = null) {
        parent::__construct($name, $extension, $parent);
        $this->state_clean = null;
    }

    public function clean() : void {
    }

    public function is_cleanable() : bool {
        return false;
    }

    public function is_clean(): ?bool {
        return null;
    }

}


