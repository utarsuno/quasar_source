<?php declare(strict_types=1);

namespace CodeManager\Entity\CodeManager;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Boolean\FieldBoolean;
use CodeManager\Entity\Abstractions\Traits\Number\Decimal\FieldFloat;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldInt;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointerTwo;
use CodeManager\Entity\Abstractions\Traits\Text\FieldText;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTime;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTimestamp;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;
use Doctrine\ORM\Mapping\ManyToOne;

/**
 * Class EntityCodeBuild
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\RepoCodeBuild")
 * @Table(name="code_build")
 */
class EntityCodeBuild extends AbstractEntity {
    // Build typeID.
    use FieldInt;
    // Stores the output of individual build steps.
    use FieldText;
    // Duration in seconds.
    use FieldFloat;
    // A pointer to EntityDBSnapshot and EntityQAReport.
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
    public const BUILD_TYPE_NOT_SAFE = 2;

    /**
     * EntityCodeBuild constructor.
     * @param int $build_type
     */
    public function __construct(int $build_type=self::BUILD_TYPE_FULL) {
        $this->set_timestamp(-1)
            ->set_build_type($build_type);
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
        return $this->isInt0EqualTo(self::BUILD_TYPE_NOT_SAFE);
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
