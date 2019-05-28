<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 00:06
 */

namespace CodeManager\Entity\File;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use CodeManager\Entity\Abstractions\Traits\Time\FieldFirstCached;
use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Time\FieldLastCached;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldTypeID;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping\Column;
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
    use FieldLastCached;
    use FieldFirstCached;
    use FieldID;
    use FieldTypeID;

    public const TABLE_NAME      = 'entity_directory';
    public const SORT_FIELD_TIME = 'last_cached';

    public const TYPE_NO_MATCH = -1;
    public const TYPE_IGNORE   = 1;

    /**
     * @Column(name="path", type="string", nullable=false, unique=false, length=256)
     */
    private $path;

    /**
     * @ManyToOne(targetEntity="CodeManager\Entity\File\EntityDirectory", inversedBy="directories")
     */
    private $parent_directory;

    /**
     * @OneToMany(targetEntity="CodeManager\Entity\File\EntityFile", mappedBy="directory")
     */
    private $files;

    /**
     * @OneToMany(targetEntity="CodeManager\Entity\File\EntityDirectory", mappedBy="parent_directory")
     */
    private $directories;

    public function __construct() {
        $this->files       = new ArrayCollection();
        $this->directories = new ArrayCollection();
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

    public function cache_needs_update(bool $trigger_update): bool {
        return false;
    }

    public function cache_update(bool $update_state=true): void {}

    public function on_event_born($data): void {}

    public function cache_set(string $cache_key): void {}
}
