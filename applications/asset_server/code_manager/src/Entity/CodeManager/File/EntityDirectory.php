<?php declare(strict_types=1);

namespace CodeManager\Entity\CodeManager\File;

use CodeManager\Entity\Abstractions\AbstractEntity;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\Table;
use Exception;
use QuasarSource\SQL\Doctrine\Entity\Field\Number\Int\Byte\TraitSizeInBytes;
use QuasarSource\SQL\Doctrine\Entity\Field\Number\Int\Small\TraitSmallInt0;
use QuasarSource\SQL\Doctrine\Entity\Field\Text\TraitFullPath;
use QuasarSource\SQL\Doctrine\Entity\Field\Text\TraitSHA512Sum;
use QuasarSource\SQL\Doctrine\Entity\Field\Time\TraitUnixTime0;
use QuasarSource\Utils\DataType\UtilsArray      as ARY;
use QuasarSource\Utils\File\UtilsDirectory      as DIR;
use QuasarSource\SQL\Doctrine\Fields\EnumFields as FIELD;


/**
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\File\RepoDirectory")
 * @Table(name="directory")
 *
 * @method EntityDirectory set_cache_last_updated(int $timestamp)
 * @method EntityDirectory set_type(int $directory_type)
 * @method int|null get_cache_last_updated()
 * @method int|null get_type()
 */
class EntityDirectory extends AbstractEntity {
    use TraitFullPath;
    use TraitSizeInBytes;
    use TraitSHA512Sum;
    // {last time instance of a cache update}
    use TraitUnixTime0;
    // {directory type}
    use TraitSmallInt0;

    public const TYPE_NO_MATCH = -1;
    public const TYPE_IGNORE   = 1;

    /** @var string $db_table_name */
    public static $db_table_name   = 'directory';
    protected static $func_aliases = [
        'cache_last_updated' => FIELD::UNIX_TIME_0,
        'type'               => FIELD::SMALL_INT_0
    ];

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
     * @JoinColumn(name="directory_id", referencedColumnName="id")
     */
    private $directory;

    public function __construct() {
        $this->files       = new ArrayCollection();
        $this->directories = new ArrayCollection();
    }

    /**
     * @return array
     * @throws Exception
     */
    public function get_all_paths(): array {
        // TODO: Don't re-calculate each call.
        $files     = [];
        $dirs      = [];
        $all_paths = [];
        DIR::get_all_contents($this->getFullPath(), false, $files, $dirs);
        ARY::ref_append_both($all_paths, $files, $dirs);
        return $all_paths;
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
