<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:13
 */

namespace CodeManager\Entity\File;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldIntTwo;
use CodeManager\Entity\Abstractions\Traits\Text\FieldTextTwo;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTimeTwo;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\HasLifecycleCallbacks;
use Doctrine\ORM\Mapping\OneToOne;
use Doctrine\ORM\Mapping\PreRemove;
use Doctrine\ORM\Mapping\Table;
use Exception;
use QuasarSource\DataStructure\CacheTable\CacheTableInterface;
use QuasarSource\DataStructure\CacheTable\TraitCacheTable;
use QuasarSource\Utilities\Exception\LogicException;
use QuasarSource\Utilities\File\UtilsFile      as UFO;
use QuasarSource\Utilities\File\UtilsPath      as UPO;
use QuasarSource\Utilities\File\UtilsPath      as PATH;
use QuasarSource\Utilities\Math\UtilsMath      as MATH;
use QuasarSource\Enums\EnumFileTypeExtensions  as EXTENSION;
use QuasarSource\Utilities\DataType\UtilsArray as ARY;


/**
 * Class EntityFile
 * @package CodeManager\Entity\File
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\RepoFile")
 * @HasLifecycleCallbacks()
 * @Table(name="file")
 */
class EntityFile extends EntityState implements EntityInterface, CacheTableInterface {
    use TraitCacheTable;
    use FieldID;
    // The time instance that this file was first and last cached at.
    use FieldUnixTimeTwo;
    // Name, SHA512SUM.
    use FieldTextTwo;
    // Rank, SizeInBytes.
    use FieldIntTwo;

    public static $db_table_name = 'file';

    // TESTING

    /** @PreRemove() */
    public function before_remove(): void {
        var_dump('Entity{' . $this->getName() . '}');
        var_dump($this->hasChild());
        var_dump($this->hasParent());


        var_dump('AN ENTITY FILE IS ABOUT TO BE REMOVED!');
    }

    // TESTING

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

    public const FLAG_MINIFY           = 'minify';
    public const FLAG_PRE_PROCESS      = 'pre_process';
    public const FLAG_GZIP             = 'gzipped';

    private const CACHE_KEY_SHA512_SUM = 'cache_sha512_sum';

    /**
     * @Column(name="extension", type="string", nullable=false, unique=false, length=16)
     */
    private $extension;

    /**
     * @Column(name="full_path", type="string", nullable=false, unique=false, length=1024)
     */
    private $full_path;

    #/**
    # * @ManyToOne(targetEntity="CodeManager\Entity\File\EntityDirectory", inversedBy="files")
    # */
    #private $directory;

    /**
     * @var EntityFile
     * @OneToOne(targetEntity="CodeManager\Entity\File\EntityFile", mappedBy="child")
     */
    private $parent;

    /**
     * @var EntityFile
     * @OneToOne(targetEntity="CodeManager\Entity\File\EntityFile", inversedBy="parent")
     */
    private $child;

    /**
     * @Column(name="content", type="blob", nullable=true, unique=false)
     */
    private $content;

    /**
     * @inheritDoc
     */
    public function cache_calculate(string $key) {
        if ($key === self::CACHE_KEY_SHA512_SUM) {
            return UFO::get_sha512sum($this->getFullPath());
        }
        return null;
    }

    /**
     * @param string $path
     * @return int
     * @throws LogicException
     */
    public static function get_file_type_from_path(string $path) : int {
        $all_extensions = PATH::get_all_extensions($path);
        foreach (self::EXTENSION_TO_TYPE as $extension => $type) {
            if (ARY::contains($all_extensions, $extension)) {
                return $type;
            }
        }
        throw LogicException::invalid_function_call('get_file_type_from_path', 'No file type match for {' . $path . '}');
    }

    public function get_flags(): array {
        $options = [
            self::FLAG_GZIP        => $this->getIsGzipped(),
            self::FLAG_MINIFY      => $this->getIsMinified(),
            self::FLAG_PRE_PROCESS => $this->getIsPreProcessed()
        ];
        return $options;
    }

    public function set_flags(array $flags): void {
        foreach ($flags as $flag => $value) {
            $this->set_flag($flag, $value);
        }
    }

    public function set_flag(string $key, bool $value): void {
        switch ($key) {
            case self::FLAG_PRE_PROCESS:
                $this->setIsPreProcessed($value);
                break;
            case self::FLAG_GZIP:
                $this->setIsGzipped($value);
                break;
            case self::FLAG_MINIFY:
                $this->setIsMinified($value);
                break;
        }
    }

    /**
     * @param $full_path
     * @throws Exception
     */
    public function on_event_born($full_path): void {
        $this->setUnixTime0(-1);
        $this->setFullPath($full_path);
        $this->setTypeID(self::get_file_type_from_path($full_path));
        $this->setRank(0);
        $this->setIsGzipped(false);
        $this->setIsMinified(false);
        $this->setIsPreProcessed(false);
        $this->setText0(UPO::get_file_name($full_path));
        $this->setExtension(UPO::get_ending_extension($full_path));
        $this->cache_update(false);
    }

    public function cache_needs_update(bool $trigger_update): bool {
        $needs_update = $this->sha512sum !== $this->cache_get(self::CACHE_KEY_SHA512_SUM);
        if ($needs_update) {
            if ($trigger_update) {
                $this->cache_update(true);
            }
            return true;
        }
        return false;
    }

    /**
     * Called when DB values are out of date compared to the file's current values (to then update them if needed).
     *
     * @param bool $update_state [If the Entity state should be updated.]
     *
     * @return void
     * @throws Exception
     */
    public function cache_update(bool $update_state = true): void {
        $this->setUnixTimestampEnd(-1);
        $this->setSizeInBytes(UFO::get_size($this->full_path));
        $this->setSha512sum($this->cache_get(self::CACHE_KEY_SHA512_SUM));
        if ($update_state) {
            $this->set_state(EntityState::STATE_UPDATED);
        }
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
     * @return mixed
     */
    public function getExtension(): string {
        return $this->extension;
    }

    /**
     * @param mixed $extension
     * @return self
     */
    public function setExtension($extension): self {
        $this->extension = $extension;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getParent() {
        return $this->parent;
    }

    /**
     * @return bool
     */
    public function hasParent(): bool {
        return $this->parent !== null;
    }

    public function remove_parent(): void {
        $this->parent = null;
    }

    /**
     * @param mixed $parent
     * @return self
     */
    public function setParent($parent): self {
        $this->parent = $parent;
        $this->setRank($parent->getRank() + 1);
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
        $this->child->setRank($this->getRank() + 1);
        return $this;
    }

    public function remove_child(): void {
        $this->child = null;
    }

    /**
     * @return mixed
     */
    public function getContent() {
        return $this->content;
    }

    /**
     * @param mixed $content
     * @return self
     */
    public function setContent($content) : self {
        $this->content = $content;
        return $this;
    }

    /**
     * @return string
     */
    public function getFullPath() : string {
        return $this->full_path;
    }

    /**
     * @param string $full_path
     * @return self
     */
    public function setFullPath(string $full_path) : self {
        $this->full_path = $full_path;
        return $this;
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
}
