<?php declare(strict_types=1);

namespace CodeManager\Entity\CodeManager;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Boolean\FieldBoolean;
use CodeManager\Entity\Abstractions\Traits\Number\Decimal\FieldFloat;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldInt;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointerTwo;
use CodeManager\Entity\Abstractions\Traits\Text\FieldBigText;
use CodeManager\Entity\Abstractions\Traits\Text\FieldBigTextTwo;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTime;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTimestamp;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;

/**
 * Class EntityCodeBuild
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\RepoCodeBuild")
 * @Table(name="code_build")
 */
class EntityCodeBuild extends AbstractEntity {
    // Build typeID.
    use FieldInt;

    // Output of individual build steps, logging for this session.
    use FieldBigTextTwo;

    // Duration in seconds.
    use FieldFloat;
    // A pointer to EntitySnapshotDB and EntitySnapshotQA.
    use FieldEntityPointerTwo;
    // Time the build ran at.
    use FieldUnixTime;
    use FieldUnixTimestamp;
    // Did the code build pass or not.
    use FieldBoolean;

    public static $sort_field_time = 'unix_timestamp0';

    /** @var string $db_table_name */
    public static $db_table_name = 'code_build';

    public const BUILD_TYPE_FULL     = 1;
    public const BUILD_TYPE_DEFAULT  = 2;
    public const BUILD_TYPE_RUSHED   = 3;

    /**
     * EntityCodeBuild constructor.
     * @param int $build_type
     */
    public function __construct(int $build_type=self::BUILD_TYPE_DEFAULT) {
        $this->set_timestamp(-1)
            ->set_build_type($build_type);
    }

    /**
     * @param  string|array $logs
     * @return EntityCodeBuild
     */
    public function set_session_logging_records($logs): self {
        $this->setBlob1(is_array($logs) ? json_encode($logs) : $logs);
        return $this;
    }

    /**
     * @return string
     */
    public function get_session_logging_records(): string {
        return $this->getBlob1();
    }

    /**
     * @param int $build_type
     * @return EntityCodeBuild
     */
    public function set_build_type(int $build_type): self {
        return $this->setInt0($build_type);
    }

    /**
     * @return bool
     */
    public function is_mode_rushed(): bool {
        return $this->isInt0EqualTo(self::BUILD_TYPE_RUSHED);
    }

    #public function get_current_db_snapshot(): EntityDBSnapshot {
    #    return
    #}

    /**
     * @param  bool $build_passed
     * @return EntityCodeBuild
     */
    public function set_build_passed(bool $build_passed): self {
        return $this->setBooleanValue0($build_passed);
    }

}
