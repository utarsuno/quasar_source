<?php declare(strict_types=1);

namespace CodeManager\Entity\CodeManager;

use CodeManager\Entity\Abstractions\Traits\Boolean\FieldBoolean;
use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Number\Decimal\FieldFloat;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldInt;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointerTwo;
use CodeManager\Entity\Abstractions\Traits\Text\FieldText;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTime;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityCodeBuild
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\EntityCodeBuildRepository")
 * @Table(name="code_builds")
 */
class EntityCodeBuild {
    use FieldID;
    // Build typeID.
    use FieldInt;
    //
    use FieldText;
    // Duration in seconds.
    use FieldFloat;
    // A pointer to EntityDBSnapshot and EntityQAReport.
    use FieldEntityPointerTwo;
    // Time the build ran at.
    use FieldUnixTime;
    // Did the code build pass or not.
    use FieldBoolean;

    public const BUILD_TYPE_FULL    = 1;
    public const BUILD_TYPE_DEFAULT = 2;
    public const BUILD_TYPE_RUSH    = 3;

    public function __construct(int $build_type=self::BUILD_TYPE_FULL) {
        $this->setUnixTimestamp0(-1);
        $this->setInt0($build_type);
    }

    public function is_mode_rushed(): bool {
        return $this->isInt0EqualTo(self::BUILD_TYPE_RUSH);
    }

    #public function get_current_db_snapshot(): EntityDBSnapshot {
    #    return
    #}

}
