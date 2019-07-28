<?php declare(strict_types=1);

namespace QuasarSource\CodeAbstractions;

use QuasarSource\Traits\PatternParentChild\InterfacePatternChild;
use QuasarSource\CommonFeatures\TraitName;

abstract class FileAbstraction implements InterfacePatternChild {
    use TraitName;

    protected $is_type_file;
    protected $path_relative;
    protected $path_full;
    protected $cached;
    protected $state_clean;

    public function __construct(string $name, string $path_relative, bool $is_type_file, FileAbstraction $parent=null) {
        if ($parent !== null) {
            $this->set_parent($parent);
        }
        $this->name          = $name;
        $this->is_type_file  = $is_type_file;
        $this->path_relative = $path_relative;
        $this->cached        = false;

        if (!$this->is_type_file) {
            if ($parent === null) {
                $this->path_full = DIRECTORY_SEPARATOR . $this->path_relative;
            } else {
                $this->path_full = $this->get_parent()->get_path_full() . $this->path_relative;
            }
        } else if ($parent === null) {
            $this->path_full = $this->path_relative;
        } else {
            $this->path_full = $this->get_parent()->get_path_full() . $this->path_relative;
        }
    }

    public function is_file(): bool {
        return $this->is_type_file;
    }

    public function get_path_relative(): string {
        return $this->path_relative;
    }

    public function get_path_full(): string {
        return $this->path_full;
    }

}
