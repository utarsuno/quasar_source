<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 13:45
 */

namespace QuasarSource\CodeAbstractions\File;
use QuasarSource\CodeAbstractions\FileAbstraction;
use QuasarSource\Traits\PatternParentChild\TraitPatternChild;
use QuasarSource\Utilities\FileUtilities as UFO;


abstract class FileInstance extends FileAbstraction {
    // The file is a child to a directory.
    use TraitPatternChild;

    protected $extension;
    protected $loaded;
    protected $loaded_lines;
    protected $contents;
    protected $file_lines;

    public function __construct(string $name, string $extension, FileAbstraction $parent=null) {
        parent::__construct($name, $name . $extension, true, $parent);
        $this->extension    = $extension;
        $this->loaded       = false;
        $this->loaded_lines = false;
        $this->contents     = null;
        $this->file_lines   = [];
    }

    public function get_lines() : array {
        if (!$this->loaded_lines) {
            $this->file_lines = UFO::get_contents_as_list($this->get_path_full());
            $this->loaded_lines = true;
        }
        return $this->file_lines;
    }

    public function get_contents() {
        if (!$this->loaded) {
            $this->contents = $this->load_contents();
        }
        return $this->contents;
    }

    abstract protected function load_contents();

}


