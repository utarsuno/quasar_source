<?php declare(strict_types=1);

namespace CodeManager\Entity\CodeManager;

use CodeManager\Entity\Abstractions\AbstractEntity;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\SQL\Doctrine\Entity\Field\Boolean\TraitBool0;
use QuasarSource\SQL\Doctrine\Entity\Field\Number\Float\TraitFloat0;
use QuasarSource\SQL\Doctrine\Entity\Field\Number\Int\Small\TraitSmallInt0;
use QuasarSource\SQL\Doctrine\Entity\Field\Text\Blob\TraitBigText1;
use QuasarSource\SQL\Doctrine\Entity\Field\Time\TraitUnixTime0;
use QuasarSource\SQL\Doctrine\Fields\EnumFields as FIELD;

/**
 * Class EntityCodeBuild
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\RepoCodeBuild")
 * @Table(name="code_build")
 *
 * @method EntityCodeBuild set_build_passed(bool $b)
 * @method EntityCodeBuild set_logs_build($s)
 * @method EntityCodeBuild set_logs_session($s)
 * @method EntityCodeBuild set_build_type(int $build_type)
 * @method boolean|null get_build_passed()
 * @method string|null get_logs_build()
 * @method string|null get_logs_session()
 * @method int|null get_build_type()
 */
class EntityCodeBuild extends AbstractEntity {
    // {did code build pass or not}
    use TraitBool0;
    // {time ran at}
    use TraitUnixTime0;
    // {output of individual build steps, logging for this session}
    use TraitBigText1;
    // {build type}
    use TraitSmallInt0;
    // {build total duration in seconds}
    use TraitFloat0;

    public static $sort_field_time = 'unix_timestamp0';
    public static $db_table_name   = 'code_build';
    protected static $func_aliases = [
        'build_passed' => FIELD::BOOLEAN_0,
        'ran_at'       => FIELD::UNIX_TIME_0,
        'logs_build'   => FIELD::BIG_TEXT_0,
        'logs_session' => FIELD::BIG_TEXT_1,
        'build_type'   => FIELD::SMALL_INT_0
    ];

    public const BUILD_TYPE_FULL     = 1;
    public const BUILD_TYPE_DEFAULT  = 2;
    public const BUILD_TYPE_RUSHED   = 3;

    /**
     * @var EntitySnapshotDB $entity_snapshot_db
     * @ManyToOne(targetEntity="CodeManager\Entity\CodeManager\EntitySnapshotDB")
     */
    private $entity_snapshot_db;

    /**
     * @var EntitySnapshotQA $entity_snapshot_qa
     * @ManyToOne(targetEntity="CodeManager\Entity\CodeManager\EntitySnapshotQA")
     */
    private $entity_snapshot_qa;

    /**
     * @param  EntitySnapshotDB $entity
     * @return EntityCodeBuild
     */
    public function set_snapshot_db(EntitySnapshotDB $entity): self {
        $this->entity_snapshot_db = $entity;
        return $this;
    }

    /**
     * @return EntitySnapshotDB
     */
    public function get_snapshot_db(): EntitySnapshotDB {
        return $this->entity_snapshot_db;
    }

    /**
     * @param  EntitySnapshotQA $entity
     * @return EntityCodeBuild
     */
    public function set_snapshot_qa(EntitySnapshotQA $entity): self {
        $this->entity_snapshot_qa = $entity;
        return $this;
    }

    /**
     * @return EntitySnapshotQA
     */
    public function get_snapshot_qa(): EntitySnapshotQA {
        return $this->entity_snapshot_qa;
    }

    /**
     * EntityCodeBuild constructor.
     * @param int $build_type
     */
    public function __construct(int $build_type=self::BUILD_TYPE_DEFAULT) {
        $this->setUnixTime0(-1)
            ->set_build_type($build_type);
    }

    /**
     * @return bool
     */
    public function is_mode_rushed(): bool {
        return $this->get_build_type() === self::BUILD_TYPE_RUSHED;
    }

}
