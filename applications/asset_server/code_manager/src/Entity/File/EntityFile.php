<?php declare(strict_types=1);

namespace CodeManager\Entity\File;

use CodeManager\Entity\Abstractions\AbstractEntity;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\OneToOne;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\Doctrine\Entity\Field\Number\Int\Byte\TraitSizeInBytes;
use QuasarSource\Doctrine\Entity\Field\Number\Int\Small\TraitSmallInt0;
use QuasarSource\Doctrine\Entity\Field\Text\Blob\TraitBigText0;
use QuasarSource\Doctrine\Entity\Field\Text\TraitPath;
use QuasarSource\Doctrine\Entity\Field\Text\TraitSHA512Sum;
use QuasarSource\Doctrine\Entity\Field\Time\TraitUnixTime0;
use QuasarSource\Utils\DataType\UtilsString as STR;
use QuasarSource\Utils\File\UtilsFile       as UFO;
use QuasarSource\Doctrine\Fields\EnumFields as FIELD;

/**
 * Class EntityFile
 * @package CodeManager\Entity\File
 *
 * @Entity(repositoryClass="CodeManager\Repository\File\RepoFile")
 * @Table(name="file")
 *
 * @method EntityFile set_content($content)
 * @method EntityFile set_rank(int $rank)
 * @method EntityFile set_cache_last_updated(int $timestamp)
 * @method string|null get_content()
 * @method int|null get_rank()
 * @method int|null get_cache_last_updated()
 */
class EntityFile extends AbstractEntity {
    use TraitPath;
    use TraitSizeInBytes;
    use TraitSHA512Sum;
    // {last time instance of a cache update}
    use TraitUnixTime0;
    // {rank}
    use TraitSmallInt0;
    // {Optional: textual contents of the file}
    use TraitBigText0;

    public static $db_table_name   = 'file';
    protected static $func_aliases = [
        'rank'               => FIELD::SMALL_INT_0,
        'content'            => FIELD::BIG_TEXT_0,
        'cache_last_updated' => FIELD::UNIX_TIME_0
    ];

    /**
     * @param  string|null          $path
     * @param  EntityDirectory|null $directory
     * @param  EntityFile|null      $parent
     * @return EntityFile
     */
    public static function spawn(string $path=null, EntityDirectory $directory=null, EntityFile $parent=null): EntityFile {
        $file = (new self())->setPath($path);
        if ($directory !== null) {
            $directory->addFile($file);
            $file->setDirectory($directory);
        }
        if ($path !== null) {
            $file->sync();
        }
        if ($parent !== null) {
            $parent->setChild($file);
            // Just to be safe.
            $file->setParent($parent);
            $file->set_rank($parent->get_rank());
        } else {
            $file->set_rank(0);
        }
        return $file;
    }

    /** @var array $cached_file_contents */
    private $cached_file_contents;

    /**
     * Parent directory.
     *
     * @ManyToOne(targetEntity="CodeManager\Entity\File\EntityDirectory", inversedBy="files")
     * @JoinColumn(name="directory_id", referencedColumnName="id")
     */
    private $directory;

    /**
     * Parent EntityFile.
     *
     * @var EntityFile
     * @OneToOne(targetEntity="CodeManager\Entity\File\EntityFile", mappedBy="child")
     * @JoinColumn(name="child_id", referencedColumnName="id")
     */
    private $parent;

    /**
     * Child EntityFile.
     *
     * @var EntityFile
     * @OneToOne(targetEntity="CodeManager\Entity\File\EntityFile", inversedBy="parent")
     * @JoinColumn(name="parent_id", referencedColumnName="id")
     */
    private $child;

    /**
     * @var EntityFileType
     *
     * @ManyToOne(targetEntity="CodeManager\Entity\File\EntityFileType", inversedBy="entity_files")
     * @JoinColumn(name="file_type_id", referencedColumnName="id")
     */
    private $file_type;

    # --------------------------------------------------- M A G I C ----------------------------------------------------
    public function __destruct() {
        unset($this->cached_file_contents);
        $this->trait_destruct_path();
        $this->trait_destruct_sha512sum();
    }

    /**
     * @return string
     */
    public function __toString(): string {
        return $this->getPath(); #'EntityFile{' . $this->getPath() . '}';
    }
    # -------------------------------------------------- P U B L I C ---------------------------------------------------

    /**
     * @return bool
     */
    public function sync(): bool {
        $f0 = $this->syncSHA512Sum($this->get_cached_latest_sha512sum());
        $f1 = $this->syncSizeInBytes(UFO::get_size($this->getPath()));
        if ($f0 || $f1) {
            $this->set_cache_last_updated(-1);
            return true;
        }
        return false;
    }

    /**
     * @param  EntityFileType $file_type
     * @return string
     */
    public function get_name_as_type(EntityFileType $file_type): string {
        return STR::replace(
            $this->get_file_name(true), $this->get_file_extensions(), $file_type->getAsString()
        );
    }

    # ------------------------------------------------- G E T T E R S --------------------------------------------------

    /**
     * @param  bool $as_string
     * @return array|string
     */
    public function get_contents(bool $as_string=false) {
        if ($this->cached_file_contents === null) {
            $this->cached_file_contents = UFO::get($this->getPath(), $as_string);
        }
        return $this->cached_file_contents;
    }

    /**
     * @return bool
     */
    public function has_sha512sum_changed(): bool {
        return $this->get_cached_latest_sha512sum() !== $this->getSHA512Sum();
    }

    /**
     * @return bool
     */
    public function hasParent(): bool {
        return $this->parent !== null;
    }

    /**
     * @return bool
     */
    public function hasChild(): bool {
        return $this->child !== null;
    }

    /**
     * @return EntityDirectory
     */
    public function getDirectory(): EntityDirectory {
        return $this->directory;
    }

    /**
     * @return EntityFileType
     */
    public function getFileType(): EntityFileType {
        return $this->file_type;
    }

    /**
     * @return int
     */
    public function getFileTypeGroup(): int {
        return $this->file_type->getEntityType();
    }

    /**
     * @return string
     */
    public function getFileTypeString(): string {
        return $this->file_type->getAsString();
    }

    /**
     * @return EntityFile|null
     */
    public function getParent(): ?EntityFile {
        return $this->parent;
    }

    /**
     * @return EntityFile|null
     */
    public function getChild(): ?EntityFile {
        return $this->child;
    }

    # ------------------------------------------------- S E T T E R S --------------------------------------------------

    /**
     * @param  EntityFile $parent
     * @return self
     */
    public function setParent(EntityFile $parent): self {
        $this->parent = $parent;
        $this->set_rank($this->parent->get_rank() + 1);
        if (!$this->parent->hasChild()) {
            $this->parent->setChild($this);
        }
        return $this;
    }

    /**
     * @param  EntityFile $child
     * @return self
     */
    public function setChild(EntityFile $child): self {
        $this->child = $child;
        $this->child->set_rank($this->get_rank() - 1);
        if (!$this->child->hasParent()) {
            $this->child->setParent($this);
        }
        return $this;
    }

    /**
     * @param  EntityFileType $file_type
     * @return EntityFile
     */
    public function setFileType(EntityFileType $file_type): self {
        $this->file_type = $file_type;
        $file_type->add_entity_file($this);
        return $this;
    }

    /**
     * @param $directory
     * @return self
     */
    public function setDirectory(EntityDirectory $directory): self {
        $this->directory = $directory;
        return $this;
    }

    # ----------------------------------------------- C A L C U L A T E ------------------------------------------------
    /**
     * @return string
     */
    protected function get_cached_latest_sha512sum(): string {
        if ($this->latest_sha512sum_to_update_to === null) {
            $this->latest_sha512sum_to_update_to = UFO::get_sha512sum($this->getPath());
        }
        return $this->latest_sha512sum_to_update_to;
    }
}
