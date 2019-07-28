<?php declare(strict_types=1);

namespace CodeManager\Entity\CodeManager\File;

use CodeManager\Entity\Abstractions\AbstractEntity;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\SQL\Doctrine\Entity\Field\Boolean\TraitBool2NotNull;
use QuasarSource\SQL\Doctrine\Entity\Field\Number\Int\Small\TraitEntityType;
use QuasarSource\SQL\Doctrine\Fields\EnumFields as FIELD;

/**
 * Class EntityFileType
 * @package CodeManager\Entity\File
 *
 * @Entity(
 *     repositoryClass="CodeManager\Repository\CodeManager\File\RepoFileType",
 *     readOnly=true
 * )
 * @Table(
 *     name="file_type",
 *     indexes={
 *          @Index(name="text_match_on_file_type", columns={"as_string"})
 *     }
 *)
 *
 * @method EntityFileType set_is_minified(bool $b)
 * @method EntityFileType set_is_processed(bool $b)
 * @method EntityFileType set_is_gzipped(bool $b)
 * @method bool|null get_is_minified()
 * @method bool|null get_is_processed()
 * @method bool|null get_is_gzipped()
 *
 */
class EntityFileType extends AbstractEntity {
    // Represents the extension group (.css.gz and .min.css would both fall under .css)
    use TraitEntityType;
    // {minified, pre_processed, gzipped}
    use TraitBool2NotNull;

    /** @var string $db_table_name */
    public static $db_table_name   = 'file_type';
    protected static $func_aliases = [
        'is_minified'  => FIELD::BOOLEAN_0_NOT_NULL,
        'is_processed' => FIELD::BOOLEAN_1_NOT_NULL,
        'is_gzipped'   => FIELD::BOOLEAN_2_NOT_NULL
    ];

    public const GROUP_NO_MATCH        = -1;
    public const GROUP_CSS             = 1;
    public const GROUP_HTML            = 2; # Used to be 3
    public const GROUP_XML             = 3; # Used to be 2
    public const GROUP_JSON            = 4;
    public const GROUP_SHADER_VERTEX   = 5;
    public const GROUP_SHADER_FRAGMENT = 6;
    public const GROUP_WEB_MANIFEST    = 7;
    public const GROUP_LICENSE         = 8;
    public const GROUP_READ_ME         = 9;
    public const GROUP_YAML            = 10;

    /**
     * @var EntityFile
     * @OneToMany(targetEntity="CodeManager\Entity\CodeManager\File\EntityFile", mappedBy="file_type")
     */
    private $entity_files;

    /**
     * @var string
     * @Column(name="as_string", type="string", nullable=false, unique=true, length=32)
     */
    protected $as_string;

    public function __construct() {
        $this->entity_files = new ArrayCollection();
    }

    /**
     * @param EntityFile $file
     */
    public function mark_entity_file(EntityFile $file): void {
        $this->entity_files->add($file);
        $file->setFileType($this);
    }

    /**
     * @return string
     */
    public function getAsString(): string {
        return $this->as_string;
    }

    /**
     * @return ArrayCollection
     */
    public function get_entity_files(): ArrayCollection {
        return $this->entity_files;
    }

}
