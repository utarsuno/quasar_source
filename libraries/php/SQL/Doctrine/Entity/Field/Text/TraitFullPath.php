<?php declare(strict_types=1);

namespace QuasarSource\SQL\Doctrine\Entity\Field\Text;

use Doctrine\ORM\Mapping\Column;
use QuasarSource\Utils\File\UtilsPath as PATH;

/**
 * Trait TraitFullPath
 * @package CodeManager\Entity\Abstractions\Traits\Text
 */
trait TraitFullPath {

    /**
     * @var string
     * @Column(name="full_path", type="string", nullable=false, unique=true, length=1024)
     */
    protected $full_path;

    protected $path_cache_directory;
    protected $path_cache_file_name;
    protected $path_cache_file_extensions;
    protected $path_cache_file_name_full;

    public function trait_destruct_full_path(): void {
        unset($this->path_cache_directory, $this->path_cache_file_name, $this->path_cache_file_name_full, $this->path_cache_file_extensions);
    }

    /**
     * @return string
     */
    public function getFullPath(): string {
        return $this->full_path;
    }

    /**
     * @param  string $full_path
     * @return self
     */
    public function setFullPath(string $full_path): self {
        PATH::is_valid($full_path, true);
        $this->full_path                  = $full_path;
        $segments                         = PATH::get_all_path_segments($full_path);
        $this->path_cache_directory       = $segments[0];
        $this->path_cache_file_name       = $segments[1];
        $this->path_cache_file_extensions = $segments[2];
        $this->path_cache_file_name_full  = $this->path_cache_file_name . $this->path_cache_file_extensions;
        return $this;
    }
}
