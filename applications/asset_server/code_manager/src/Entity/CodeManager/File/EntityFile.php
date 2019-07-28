<?php declare(strict_types=1);

namespace CodeManager\Entity\CodeManager\File;

use CodeManager\Entity\Abstractions\AbstractEntity;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\OneToOne;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\SQL\Doctrine\Entity\Field\Number\Int\Byte\TraitSizeInBytes;
use QuasarSource\SQL\Doctrine\Entity\Field\Number\Int\Small\TraitSmallInt0;
use QuasarSource\SQL\Doctrine\Entity\Field\Text\Blob\TraitBigText0;
use QuasarSource\SQL\Doctrine\Entity\Field\Text\TraitFullPath;
use QuasarSource\SQL\Doctrine\Entity\Field\Text\TraitSHA512Sum;
use QuasarSource\SQL\Doctrine\Entity\Field\Time\TraitUnixTime0;
use QuasarSource\Utils\File\UtilsFile                   as UFO;
use QuasarSource\Utils\Math\UtilsMath                   as MATH;
use QuasarSource\Utils\File\Enum\EnumFileTypeExtensions as EXTENSION;
use QuasarSource\SQL\Doctrine\Fields\EnumFields         as FIELD;

/**
 * Class EntityFile
 * @package CodeManager\Entity\CodeManager\File
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\File\RepoFile")
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
    use TraitFullPath;
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

    public const TYPE_NO_MATCH        = -1;
    public const TYPE_CSS             = 1;
    public const TYPE_XML             = 2;
    public const TYPE_HTML            = 3;
    public const TYPE_JSON            = 4;
    public const TYPE_SHADER_VERTEX   = 5;
    public const TYPE_SHADER_FRAGMENT = 6;
    public const TYPE_WEB_MANIFEST    = 7;
    public const TYPE_LICENSE         = 8;
    public const TYPE_READ_ME         = 9;
    public const TYPE_YAML            = 10;

    public const EXTENSION_TO_TYPE    = [
        EXTENSION::CSS             => self::TYPE_CSS,
        EXTENSION::XML             => self::TYPE_XML,
        EXTENSION::HTML            => self::TYPE_HTML,
        EXTENSION::JSON            => self::TYPE_JSON,
        EXTENSION::SHADER_VERTEX   => self::TYPE_SHADER_VERTEX,
        EXTENSION::SHADER_FRAGMENT => self::TYPE_SHADER_FRAGMENT,
        EXTENSION::WEB_MANIFEST    => self::TYPE_WEB_MANIFEST,
        EXTENSION::YAML            => self::TYPE_YAML
    ];

    /**
     * Parent directory.
     *
     * @ManyToOne(targetEntity="CodeManager\Entity\CodeManager\File\EntityDirectory", inversedBy="files")
     * @JoinColumn(name="directory_id", referencedColumnName="id")
     */
    private $directory;

    /**
     * Parent EntityFile.
     *
     * @var EntityFile
     * @OneToOne(targetEntity="CodeManager\Entity\CodeManager\File\EntityFile", mappedBy="child")
     * @JoinColumn(name="child_id", referencedColumnName="id")
     */
    private $parent;

    /**
     * Child EntityFile.
     *
     * @var EntityFile
     * @OneToOne(targetEntity="CodeManager\Entity\CodeManager\File\EntityFile", inversedBy="parent")
     * @JoinColumn(name="parent_id", referencedColumnName="id")
     */
    private $child;

    /**
     * @var EntityFileType
     *
     * @ManyToOne(targetEntity="CodeManager\Entity\CodeManager\File\EntityFileType", inversedBy="entity_files")
     * @JoinColumn(name="file_type_id", referencedColumnName="id")
     */
    private $file_type;

    public function __destruct() {
        $this->trait_destruct_full_path();
    }

    /**
     * @return bool
     */
    public function has_sha512sum_changed(): bool {
        return $this->get_cached_latest_sha512sum() !== $this->getSHA512Sum();
    }

    /**
     * @return EntityFileType
     */
    public function getFileType(): EntityFileType {
        return $this->file_type;
    }

    /**
     * @return string
     */
    public function getFileTypeString(): string {
        return $this->file_type->getAsString();
    }

    /**
     * @param  EntityFileType $entity
     * @return EntityFile
     */
    public function setFileType(EntityFileType $entity): self {
        $this->file_type = $entity;
        return $this;
    }

    /**
     * @return EntityDirectory
     */
    public function getDirectory(): EntityDirectory {
        return $this->directory;
    }

    /**
     * @param $directory
     * @return self
     */
    public function setDirectory(EntityDirectory $directory): self {
        $this->directory = $directory;
        return $this;
    }

    public function getFullName(): string {
        return $this->name . $this->extension;
    }

    /**
     * @return EntityFile|null
     */
    public function getParent(): ?EntityFile {
        return $this->parent;
    }

    /**
     * @return bool
     */
    public function hasParent(): bool {
        return $this->parent !== null;
    }

    /**
     * @param  EntityFile $parent
     * @return self
     */
    public function setParent(EntityFile $parent): self {
        $this->parent = $parent;
        $this->set_rank($parent->get_rank() + 1);
        return $this;
    }

    /**
     * @return mixed
     */
    public function getChild() {
        return $this->child;
    }

    public function get_child_recursively() : EntityFile {
        if ($this->child === null) {
            return $this;
        }
        return $this->child->get_child_recursively();
    }

    /**
     * @return bool
     */
    public function hasChild(): bool {
        return $this->child !== null;
    }

    /**
     * @param mixed $child
     * @return self
     */
    public function setChild($child): self {
        $this->child = $child;
        $this->child->set_rank($this->get_rank() + 1);
        return $this;
    }

    public function remove_child(): void {
        $this->child = null;
    }

    public function to_full_string(?EntityFile $relative_to=null) : string {
        $info = ' --------- EntityFile{' . $this->getName() . $this->getExtension() . '}:' . PHP_EOL;
        $info .= "\tpath{" . $this->getFullPath() . '}' . PHP_EOL;
        if ($relative_to !== null) {
            $base = $this->getSizeInBytes();
            $new  = $relative_to->getSizeInBytes();
            $dif  = MATH::percentage_decreased($base, $new, true);
            $info .= "\tsize{" . $base . '} to {' . $new . '}, reduction of(' . $dif . ')' . PHP_EOL;
        } else {
            $info .= "\tsize{" . $this->getSizeInBytes() . '}' . PHP_EOL;
        }
        if ($this->hasParent()) {
            $info .= "\tparent{" . $this->getParent()->getFullName() . '}' . PHP_EOL;
        }
        if ($this->hasChild()) {
            $info .= "\tchild{" . $this->getChild()->getFullName() . '}' . PHP_EOL;
        }
        $info .= '------------------------------------------------------------------------' . PHP_EOL;
        return $info;
    }

    public function __toString() {
        return 'EntityFile{' . $this->getFullPath() . '}';
    }

    // ------ U T I L I T Y ------

    public function get_full_name_minified() : string {
        return $this->name . EXTENSION::MINIFIED . $this->extension;
    }

    public function get_full_name_processed() : string {
        return $this->name . '.processed' . $this->extension;
    }

    public function get_full_name_gzipped() : string {
        return $this->getFullName() . EXTENSION::GZIPPED;
    }

    // ----

    public function sync(): void {
        var_dump('Syncing entity file{' . $this->getFullPath() . '}');
        $this->calculate_size();
        $this->calculate_sha512sum();
        $this->set_cache_last_updated(-1);
    }

    // ----------------------------------------------- C A L C U L A T E -----------------------------------------------

    /**
     * @return EntityFile
     */
    public function calculate_size(): self {
        return $this->setSizeInBytes(UFO::get_size($this->getFullPath()));
    }

    /**
     * @return EntityFile
     */
    public function calculate_sha512sum(): self {
        return $this->setSHA512Sum($this->get_cached_latest_sha512sum());
    }

    /**
     * @return string
     */
    protected function get_cached_latest_sha512sum(): string {
        if ($this->latest_sha512sum_to_update_to === null) {
            $this->latest_sha512sum_to_update_to = UFO::get_sha512sum($this->getFullPath());
        }
        return $this->latest_sha512sum_to_update_to;
    }
}
