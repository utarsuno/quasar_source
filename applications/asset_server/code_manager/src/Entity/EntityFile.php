<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:13
 */

namespace CodeManager\Entity;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\OneToOne;
use Doctrine\ORM\Mapping\Table;
use Exception;
use QuasarSource\DataStructures\Cached;
use QuasarSource\DataStructures\TraitCached;
use QuasarSource\Utilities\DateTimeUtilities             as TIME;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;
use QuasarSource\Utilities\ArrayUtilities                as ARY;
use QuasarSource\Utilities\Files\FileUtilities           as UFO;
use QuasarSource\Utilities\Files\PathUtilities           as UPO;
use QuasarSource\Utilities\Files\PathUtilities           as PATH;
use QuasarSource\Utilities\MathUtilities                 as MATH;


/**
 * Class EntityFile
 * @package CodeManager\Entity
 *
 * @Entity(repositoryClass="CodeManager\Repository\EntityFileRepository")
 * @ORM\HasLifecycleCallbacks()
 * @Table(
 *         name="entity_file",
 *         indexes={
 *             @Index(
 *                 name="search_entity_file",
 *                 columns={"name", "extension", "file_type", "sha512sum"}
 *             )
 *         }
 *     )
 */
class EntityFile extends EntityState implements EntityInterface, Cached {
    use TraitCached;

    public static $code_manager_service;

    // TESTING

    /** @ORM\PreRemove() */
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
        UFO::EXTENSION_CSS             => self::TYPE_CSS,
        UFO::EXTENSION_XML             => self::TYPE_XML,
        UFO::EXTENSION_HTML            => self::TYPE_HTML,
        UFO::EXTENSION_JSON            => self::TYPE_JSON,
        UFO::EXTENSION_SHADER_VERTEX   => self::TYPE_SHADER_VERTEX,
        UFO::EXTENSION_SHADER_FRAGMENT => self::TYPE_SHADER_FRAGMENT,
        UFO::EXTENSION_WEB_MANIFEST    => self::TYPE_WEB_MANIFEST,
        UFO::EXTENSION_YAML            => self::TYPE_YAML
    ];

    public const FLAG_MINIFY           = 'minify';
    public const FLAG_PRE_PROCESS      = 'pre_process';
    public const FLAG_GZIP             = 'gzipped';

    private const CACHE_KEY_SHA512_SUM = 'cache_sha512_sum';

    /**
     * @Id
     * @Column(type="integer", nullable=false, unique=true)
     * @GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var int
     * @Column(type="integer", nullable=false, unique=false)
     */
    private $rank;

    /**
     * @Column(name="file_type", type="integer", nullable=false, unique=false)
     */
    private $file_type;

    /**
     * @Column(name="name", type="string", nullable=false, unique=false, length=256)
     */
    private $name;

    /**
     * @Column(name="extension", type="string", nullable=false, unique=false, length=16)
     */
    private $extension;

    /**
     * @Column(name="full_path", type="string", nullable=false, unique=false, length=1024)
     */
    private $full_path;

    /**
     * @ManyToOne(targetEntity="CodeManager\Entity\EntityDirectory", inversedBy="files")
     */
    private $directory;

    /**
     * @var EntityFile
     * @OneToOne(targetEntity="CodeManager\Entity\EntityFile", mappedBy="child")
     */
    private $parent;

    /**
     * @var EntityFile
     * @OneToOne(targetEntity="CodeManager\Entity\EntityFile", inversedBy="parent")
     */
    private $child;

    /**
     * @Column(name="content", type="blob", nullable=true, unique=false)
     */
    private $content;

    /**
     * @Column(name="sha512sum", type="string", nullable=true, unique=true, length=512)
     */
    private $sha512sum;

    /**
     * @Column(name="size_in_bytes", type="bigint", nullable=true, unique=false)
     */
    private $size_in_bytes;

    /**
     * @var bool
     * @Column(name="is_gzipped", type="boolean", nullable=false, unique=false)
     */
    private $is_gzipped;

    /**
     * @var bool
     * @Column(name="is_minified", type="boolean", nullable=false, unique=false)
     */
    private $is_minified;

    /**
     * @var bool
     * @Column(name="is_pre_processed", type="boolean", nullable=false, unique=false)
     */
    private $is_pre_processed;

    /**
     * @Column(name="last_cached", type="datetime", nullable=true, unique=false)
     */
    private $last_cached;

    /**
     * @Column(name="first_cached", type="datetime", nullable=true, unique=false)
     */
    private $first_cached;

    public function cache_set(string $key): void {
        if ($key === self::CACHE_KEY_SHA512_SUM) {
            $this->cached_values[$key] = UFO::get_sha512sum($this->getFullPath());
        }
    }

    public static function get_file_type_from_path(string $path) : int {
        $all_extensions = PATH::get_all_extensions($path);
        foreach (self::EXTENSION_TO_TYPE as $extension => $type) {
            if (ARY::contains($all_extensions, $extension)) {
                return $type;
            }
        }
        DBG::throw_exception('No file type match for {' . $path . '}');
        return self::TYPE_NO_MATCH;
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
        $current_date_time = TIME::now();
        $this->setFirstCached($current_date_time);
        $this->setFullPath($full_path);
        $this->setFileType(self::get_file_type_from_path($full_path));
        $this->setRank(0);
        $this->setIsGzipped(false);
        $this->setIsMinified(false);
        $this->setIsPreProcessed(false);
        $this->setName(UPO::get_file_name($full_path));
        $this->setExtension(UPO::get_ending_extension($full_path));
        $this->cache_update(false);
    }

    public function cache_needs_to_be_checked() : bool {
        return $this->sha512sum !== $this->cache_get(self::CACHE_KEY_SHA512_SUM);
    }

    public function cache_needs_to_be_updated(): bool {
        return $this->cache_needs_to_be_checked();
    }

    public function cache_set_to_checked(): void {
        $this->setLastCached(TIME::now());
    }

    /**
     * When DB values are out of date compared to the file's current values, this function is called to re-update those values.
     * @param bool $update_state
     * @throws Exception
     */
    public function cache_update(bool $update_state=true): void {
        $this->cache_set_to_checked();
        $this->setSizeInBytes(UFO::get_size($this->full_path));
        $this->setSha512sum($this->cache_get(self::CACHE_KEY_SHA512_SUM));
        if ($update_state) {
            $this->set_state(EntityState::STATE_UPDATED);
        }
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
     * @return int
     */
    public function getFileType() : int {
        return $this->file_type;
    }

    /**
     * @param int $fileType
     * @return self
     */
    public function setFileType(int $fileType) : self {
        $this->file_type = $fileType;
        return $this;
    }

    /**
     * @return EntityDirectory
     */
    public function getDirectory() : EntityDirectory {
        return $this->directory;
    }

    /**
     * @param $directory
     * @return self
     */
    public function setDirectory(EntityDirectory $directory) : self {
        $this->directory = $directory;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getName() : string {
        return $this->name;
    }

    public function getFullName() : string {
        return $this->name . $this->extension;
    }

    /**
     * @param mixed $name
     * @return self
     */
    public function setName($name) : self {
        $this->name = $name;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getExtension() : string {
        return $this->extension;
    }

    /**
     * @param mixed $extension
     * @return self
     */
    public function setExtension($extension) : self {
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

    /**
     * @return int
     */
    public function getSizeInBytes() : int {
        return $this->size_in_bytes;
    }

    /**
     * @param int $sizeInBytes
     * @return self
     */
    public function setSizeInBytes(int $sizeInBytes) : self {
        $this->size_in_bytes = $sizeInBytes;
        return $this;
    }

    /**
     * @return DateTime
     */
    public function getLastCached() : DateTime {
        return $this->last_cached;
    }

    /**
     * @param DateTime $last_cached
     * @return self
     */
    public function setLastCached(DateTime $last_cached) : self {
        $this->last_cached = $last_cached;
        return $this;
    }

    /**
     * @return DateTime
     */
    public function getFirstCached() : DateTime {
        return $this->first_cached;
    }

    /**
     * @param DateTime $first_cached
     * @return self
     */
    public function setFirstCached(DateTime $first_cached) : self {
        $this->first_cached = $first_cached;
        return $this;
    }

    /**
     * @return string
     */
    public function getFullPath() : string {
        return $this->full_path;
    }

    public function get_full_name_minified() : string {
        return $this->name . UFO::EXTENSION_MINIFIED . $this->extension;
    }

    public function get_full_name_processed() : string {
        return $this->name . '.processed' . $this->extension;
    }

    public function get_full_name_gzipped() : string {
        return $this->getFullName() . UFO::EXTENSION_GZIPPED;
    }

    public function get_path_with_pre_extension(string $extension) : string {
        $path = PATH::get_directory($this->getFullPath());
        return $path . $this->getName() . $extension . $this->getExtension();
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
            $dif  = MATH::get_percentage_decreased($base, $new, true);
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

    /**
     * @return bool
     */
    public function getIsGzipped() : bool {
        return $this->is_gzipped;
    }

    /**
     * @param bool $is_gzipped
     * @return self
     */
    public function setIsGzipped(bool $is_gzipped): self {
        $this->is_gzipped = $is_gzipped;
        return $this;
    }

    /**
     * @return bool
     */
    public function getIsMinified(): bool {
        return $this->is_minified;
    }

    /**
     * @param bool $is_minified
     * @return self
     */
    public function setIsMinified(bool $is_minified): self {
        $this->is_minified = $is_minified;
        return $this;
    }

    /**
     * @return bool
     */
    public function getIsPreProcessed(): bool {
        return $this->is_pre_processed;
    }

    /**
     * @param bool $is_pre_processed
     * @return self
     */
    public function setIsPreProcessed(bool $is_pre_processed): self {
        $this->is_pre_processed = $is_pre_processed;
        return $this;
    }

    /**
     * @return int
     */
    public function getRank(): int {
        return $this->rank;
    }

    /**
     * @param int $rank
     * @return self
     */
    public function setRank(int $rank): self {
        $this->rank = $rank;
        return $this;
    }
}
