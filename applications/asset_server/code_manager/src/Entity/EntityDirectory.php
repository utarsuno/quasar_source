<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 00:06
 */

namespace CodeManager\Entity;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\Entity;

use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\DataStructures\Cached;
use QuasarSource\DataStructures\TraitCached;


/**
 * Class EntityDirectory
 * @package CodeManager\Entity
 *
 * @Entity(repositoryClass="CodeManager\Repository\EntityDirectoryRepository")
 * @Table(
 *     name="entity_directory",
 *     indexes={
 *         @Index(
 *             name="search_entity_directory",
 *             columns={"path", "directory_type", "sha512sum"}
 *         )
 *     }
 * )
 */
class EntityDirectory extends EntityState implements EntityInterface, Cached {
    use TraitCached;

    public const TYPE_NO_MATCH = -1;
    public const TYPE_IGNORE   = 1;

    /**
     * @Id
     * @Column(type="integer", nullable=false, unique=true)
     * @GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @Column(name="directory_type", type="integer", nullable=false, unique=false)
     */
    private $directory_type;

    /**
     * @Column(name="path", type="string", nullable=false, unique=false, length=256)
     */
    private $path;

    /**
     * @ManyToOne(targetEntity="CodeManager\Entity\EntityDirectory", inversedBy="directories")
     */
    private $parent_directory;

    /**
     * @OneToMany(targetEntity="CodeManager\Entity\EntityFile", mappedBy="directory")
     */
    private $files;

    /**
     * @OneToMany(targetEntity="CodeManager\Entity\EntityDirectory", mappedBy="parent_directory")
     */
    private $directories;

    /**
     * @Column(name="sha512sum", type="string", nullable=true, unique=true, length=512)
     */
    private $sha512sum;

    /**
     * @Column(name="last_cached", type="datetime", nullable=true, unique=false)
     */
    private $last_cached;

    /**
     * @Column(name="first_cached", type="datetime", nullable=true, unique=false)
     */
    private $first_cached;

    public function __construct() {
        $this->files       = new ArrayCollection();
        $this->directories = new ArrayCollection();
    }

    /**
     * @return mixed
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return self
     */
    public function setId($id) : self {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDirectoryType() {
        return $this->directory_type;
    }

    /**
     * @param mixed $directoryType
     * @return self
     */
    public function setDirectoryType($directoryType) : self {
        $this->directory_type = $directoryType;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPath() {
        return $this->path;
    }

    /**
     * @param mixed $path
     * @return self
     */
    public function setPath($path) : self {
        $this->path = $path;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getParentDirectory() {
        return $this->parent_directory;
    }

    /**
     * @param mixed $parent_directory
     * @return self
     */
    public function setParentDirectory($parent_directory) : self {
        $this->parent_directory = $parent_directory;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getFiles() : Collection {
        return $this->files;
    }

    /**
     * @param mixed $files
     * @return self
     */
    public function setFiles($files) : self {
        $this->files = $files;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDirectories() {
        return $this->directories;
    }

    /**
     * @param mixed $directories
     * @return self
     */
    public function setDirectories($directories) : self {
        $this->directories = $directories;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLastCached() {
        return $this->last_cached;
    }

    /**
     * @param mixed $last_cached
     * @return self
     */
    public function setLastCached($last_cached) : self {
        $this->last_cached = $last_cached;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getFirstCached() {
        return $this->first_cached;
    }

    /**
     * @param mixed $first_cached
     * @return self
     */
    public function setFirstCached($first_cached) : self {
        $this->first_cached = $first_cached;
        return $this;
    }

    /**
     * @return string
     */
    public function getSha512sum() : string {
        return $this->sha512sum;
    }

    /**
     * @param string $sha512sum
     * @return self
     */
    public function setSha512sum(string $sha512sum) : self {
        $this->sha512sum = $sha512sum;
        return $this;
    }

    public function cache_needs_update(bool $trigger_update): bool {
        return false;
    }

    public function cache_update(bool $update_state=true): void {}

    public function on_event_born($data): void {}

    public function cache_set(string $cache_key): void {}
}
