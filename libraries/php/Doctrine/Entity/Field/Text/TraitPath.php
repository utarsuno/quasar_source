<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Entity\Field\Text;

use Doctrine\ORM\Mapping\Column;
use QuasarSource\Utils\File\UtilsPath as PATH;

/**
 * Trait TraitPath
 * @package CodeManager\Entity\Abstractions\Traits\Text
 */
trait TraitPath {

    /**
     * @var string
     * @Column(name="path", type="string", nullable=false, unique=true, length=1024)
     */
    protected $path;

    protected $path_cache_directory;
    protected $path_cache_file_name;
    protected $path_cache_file_extensions;
    protected $path_cache_file_name_full;

    public function trait_destruct_path(): void {
        unset($this->path_cache_directory, $this->path_cache_file_name, $this->path_cache_file_name_full, $this->path_cache_file_extensions);
    }

    /**
     * @return string
     */
    public function getPath(): string {
        return $this->path;
    }

    /**
     * @param  string $path
     * @return self
     */
    public function setPath(string $path): self {
        if ($this->path !== $path) {
            PATH::is_valid($path, true);
            $this->path = $path;
            $this->calculate_cache_for_paths(false);
        }
        return $this;
    }

    /**
     * @return string
     */
    public function get_path_directory(): string {
        $this->calculate_cache_for_paths(true);
        return $this->path_cache_directory;
    }

    /**
     * @param  bool $with_extensions
     * @return string
     */
    public function get_file_name(bool $with_extensions=false): string {
        $this->calculate_cache_for_paths(true);
        if ($with_extensions) {
            return $this->path_cache_file_name_full;
        }
        return $this->path_cache_file_name;
    }

    /**
     * @return string
     */
    public function get_file_extensions(): string {
        $this->calculate_cache_for_paths(true);
        return $this->path_cache_file_extensions;
    }

    /**
     * @param  bool $set_only_if_null
     * @return TraitPath
     */
    private function calculate_cache_for_paths(bool $set_only_if_null=false): self {
        if (!$set_only_if_null || ($set_only_if_null && $this->path_cache_directory === null)) {
            $segments = PATH::get_all_path_segments($this->path);
            $this->path_cache_directory       = $segments[0];
            $this->path_cache_file_name       = $segments[1];
            $this->path_cache_file_extensions = $segments[2];
            $this->path_cache_file_name_full  = $this->path_cache_file_name . $this->path_cache_file_extensions;
        }
        return $this;
    }
}
