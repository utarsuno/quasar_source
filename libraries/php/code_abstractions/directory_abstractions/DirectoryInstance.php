<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 15:19
 */

namespace QuasarSource\CodeAbstractions\Directory;

use QuasarSource\CodeAbstractions\FileAbstraction;
use QuasarSource\CodeAbstractions\FileManager;
use QuasarSource\Traits\PatternParentChild\TraitPatternParentAndChild;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;
use QuasarSource\Utilities\Files\FileUtilities as UFO;
use QuasarSource\Utilities\Files\PathUtilities as UPO;
use QuasarSource\Utilities\Files\DirectoryUtilities as UDO;
use QuasarSource\Utilities\StringUtilities as STR;
use QuasarSource\CodeAbstractions\File\FileInstance;
use QuasarSource\Utilities\EchoUtilities as L;


class DirectoryInstance extends FileAbstraction {
    // The directory can be a parent to and a child of other directories.
    use TraitPatternParentAndChild;

    public function __construct(string $path, FileAbstraction $parent=null) {
        $path = STR::get_matches_removed($path, DIRECTORY_SEPARATOR);
        parent::__construct($path, $path . DIRECTORY_SEPARATOR, false, $parent);
    }

    public function print_tree(string $offset='') : void {
        L::ll($offset . 'D', $this->get_path_full());
        foreach ($this->children as $child) {
            if ($child->is_file()) {
                L::ll($offset . '  F', $child);
            } else {
                $child->print_tree('  ' . $offset);
            }
        }
    }

    private function add_file_from_path(string $path) : void {

        $instance = FileManager::get_needed_file_class_type($path, $this);
        if ($instance === null) {
            #DBG::throw_exception('No file created for path {' . $path . '}');
            L::l('Warning: no file created for path {' . $path . '}');
        }
    }

    private function contains_directory_path(string $path) : bool {
        return STR::contains($this->get_path_full(), $path);
    }

    public function get_local_files_of_type($file_type) : array {
        $files = [];
        foreach ($this->children as $child) {
            if ($child->is_file() && get_class($child) === $file_type) {
                $files[] = $child;
            }
        }
        return $files;
    }

    public function get_file(string $path) : ?FileInstance {
        $this->load_cache();

        if (!STR::starts_with($path, DIRECTORY_SEPARATOR)) {
            $path = DIRECTORY_SEPARATOR . $path;
        }
        $p = UPO::get_directory($path);
        $f = STR::get_matches_removed($path, $p);

        foreach ($this->children as $child) {
            if (!$child->is_file() && $child->contains_directory_path($p)) {
                $child->load_cache(true);
                $file_match = $child->find_file($path);
                if ($file_match !== null) {
                    return $file_match;
                }
            }
        }
        #$this->print_tree();
        return null;
    }

    private function find_file(string $path) {
        foreach ($this->children as $child) {
            if ($child->is_file() && STR::contains($child->get_path_full(), $path)) {
                return $child;
            }
        }
        return null;
    }

    public function load_cache(bool $use_recursion=false) : void {
        if (!$this->cached) {
            $this->cached     = true;
            $path_full        = $this->get_path_full();
            $path_files       = [];
            $path_directories = [];
            UDO::get_all_contents($path_full, $use_recursion, $path_files, $path_directories);

            foreach ($path_files as $path) {
                $p = STR::get_matches_removed($path, $path_full);
                if (!STR::contains($p, DIRECTORY_SEPARATOR)) {
                    $this->add_file_from_path(STR::get_matches_removed($path, $path_full));
                }
            }

            foreach ($path_directories as $path) {
                $directory = new DirectoryInstance(STR::get_matches_removed($path, $path_full), $this);
                if ($use_recursion) {
                    $directory->load_cache(true);
                }
            }
        }
    }

    public function is_cached() : bool {
        return $this->cached;
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
