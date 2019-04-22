<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:13
 */

namespace CodeManager\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\Utilities\FileUtilities;
use QuasarSource\Utilities\StringUtilities;


/**
 * Class EntityFile
 * @package CodeManager\Entity
 *
 * @Entity(repositoryClass="CodeManager\Repository\EntityFileRepository")
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
class EntityFile {

    public const FILE_TYPE_CSS = 1;

    /**
     * @Id
     * @Column(type="integer", nullable=false, unique=true)
     * @GeneratedValue(strategy="IDENTITY")
     */
    private $id;

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
     * @OneToMany(targetEntity="CodeManager\Entity\EntityFile", mappedBy="child")
     */
    private $parent;

    /**
     * @ManyToOne(targetEntity="CodeManager\Entity\EntityFile", inversedBy="parent")
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
     * @Column(name="last_cached", type="datetime", nullable=true, unique=false)
     */
    private $last_cached;

    /**
     * @Column(name="first_cached", type="datetime", nullable=true, unique=false)
     */
    private $first_cached;

    public function initialize(string $full_path) : self {
        $current_date_time = new DateTime('now');
        $this->setFirstCached($current_date_time);
        $this->setLastCached($current_date_time);
        $this->setFullPath($full_path);
        $this->setName(FileUtilities::path_get_file_name($full_path));
        $this->setExtension(FileUtilities::path_get_ending_extension($full_path));
        $this->setSizeInBytes(FileUtilities::file_get_size($this->full_path));
        $this->setSha512sum(FileUtilities::file_get_sha512sum($this->full_path));
        return $this;
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
    public function getFileType() {
        return $this->file_type;
    }

    /**
     * @param mixed $fileType
     * @return self
     */
    public function setFileType($fileType) : self {
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
    public function getName() {
        return $this->name;
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
    public function getExtension() {
        return $this->extension;
    }

    /**
     * @param mixed $extension
     * @return self
     */
    public function setExtension($extension) : self {
        $this->extension = $extension;
        if ($this->file_type === null) {
            if (StringUtilities::contains($this->extension, 'css')) {
                $this->file_type = self::FILE_TYPE_CSS;
            }
        }
        return $this;
    }

    /**
     * @return mixed
     */
    public function getParent() {
        return $this->parent;
    }

    /**
     * @param mixed $parent
     * @return self
     */
    public function setParent($parent) : self {
        $this->parent = $parent;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getChild() {
        return $this->child;
    }

    /**
     * @param mixed $child
     * @return self
     */
    public function setChild($child) : self {
        $this->child = $child;
        return $this;
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

    /**
     * @param string $full_path
     * @return self
     */
    public function setFullPath(string $full_path) : self {
        $this->full_path = $full_path;
        return $this;
    }

    public function __toString() {
        return 'EntityFile{' . $this->getFullPath() . '}';
    }
}
