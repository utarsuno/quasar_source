<?php declare(strict_types=1);

namespace CodeManager\Entity\CodeManager\File;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldInt;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldIntTwo;
use CodeManager\Entity\Abstractions\Traits\Text\FieldTextTwo;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTimeTwo;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\Table;

/**
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\File\RepoDirectory")
 * @Table(name="directory")
 */
class EntityDirectory extends AbstractEntity {
    // The time instance that this directory was first and last cached at.
    use FieldUnixTimeTwo;
    // SHA512SUM, relative path.
    use FieldTextTwo;
    // Directory TypeID, total_size.
    use FieldIntTwo;

    /** @var string $db_table_name */
    public static $db_table_name = 'directory';

    /**
     * Child files.
     *
     * @var Collection $files
     * @OneToMany(targetEntity="CodeManager\Entity\CodeManager\File\EntityFile", mappedBy="directory")
     */
    private $files;

    /**
     * Child directories.
     *
     * @var Collection $directories
     * @OneToMany(targetEntity="CodeManager\Entity\CodeManager\File\EntityDirectory", mappedBy="directory")
     */
    private $directories;

    /**
     * Parent directory.
     *
     * @var EntityDirectory $directory
     * @ManyToOne(targetEntity="CodeManager\Entity\CodeManager\File\EntityDirectory", inversedBy="directories")
     * @JoinColumn(nullable=false)
     */
    private $directory;

    public const TYPE_NO_MATCH = -1;
    public const TYPE_IGNORE   = 1;

    #public function __construct() {
    #    $this->files       = new ArrayCollection();
    #    $this->directories = new ArrayCollection();
    #}

    /**
     * @return int
     */
    public function get_total_size(): int {
        return $this->getInt1();
    }

    /**
     * @param  int $size
     * @return EntityDirectory
     */
    public function set_total_size(int $size): self {
        return $this->setInt1($size);
    }

    /**
     * @param  int $timestamp
     * @return EntityDirectory
     */
    public function set_last_checked(int $timestamp): self {
        return $this->setUnixTimestamp1($timestamp);
    }

    /**
     * @return int
     */
    public function get_last_checked(): int {
        return $this->unix_timestamp1;
    }

    /**
     * @param  int $timestamp
     * @return EntityDirectory
     */
    public function set_last_modified(int $timestamp): self {
        return $this->setUnixTime0($timestamp);
    }

    /**
     * @return int
     */
    public function get_last_modified(): int {
        return $this->unix_timestamp0;
    }

    /**
     * @return string
     */
    public function get_full_path(): string {
        return $this->getText0();
    }

    /**
     * @param  string $path
     * @return EntityDirectory
     */
    public function set_full_path(string $path): self {
        return $this->setText0($path);
    }

    /**
     * @return Collection
     */
    public function getFiles(): Collection {
        return $this->files;
    }

    /**
     * @param  EntityFile $file
     * @return EntityDirectory
     */
    public function addFile(EntityFile $file): self {
        if (!$this->files->contains($file)) {
            $this->files[] = $file;
            $file->setDirectory($this);
        }
        return $this;
    }

    /**
     * Un-mark the EntityFile as a child of this directory, doesn't actually delete the file or its meta-data in DB.
     * @param  EntityFile $file
     * @return EntityDirectory
     */
    public function removeFile(EntityFile $file): self {
        if ($this->files->contains($file)) {
            $this->files->removeElement($file);
            if ($file->getDirectory() === $this) {
                $file->setDirectory(null);
            }
        }
        return $this;
    }

    /**
     * @param  EntityDirectory $directory
     * @return EntityDirectory
     */
    public function addDirectory(EntityDirectory $directory): self {
        if (!$this->directories->contains($directory)) {
            $this->directories[] = $directory;
            $directory->setParentDirectory($this);
        }
        return $this;
    }

    /**
     * @param  EntityDirectory $directory
     * @return EntityDirectory
     */
    public function removeDirectory(EntityDirectory $directory): self {
        if ($this->directories->contains($directory)) {
            $this->directories->removeElement($directory);
            if ($directory->getParentDirectory() === $this) {
                $directory->setParentDirectory(null);
            }
        }
        return $this;
    }

    /**
     * @param  EntityDirectory|null $directory
     * @return EntityDirectory
     */
    public function setParentDirectory(?EntityDirectory $directory): self {
        $this->directory = $directory;
        return $this;
    }

    /**
     * @return EntityDirectory|null
     */
    public function getParentDirectory(): ?EntityDirectory {
        return $this->directory;
    }

}
