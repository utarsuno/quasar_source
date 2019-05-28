<?php

namespace CodeManager\Entity\CodeManager;

use CodeManager\Entity\Abstractions\Traits\Boolean\FieldLibVersionUpdated;
use CodeManager\Entity\Abstractions\Traits\Boolean\FieldOptional;
use CodeManager\Entity\Abstractions\Traits\Number\Decimal\FieldDuration;
use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldHasPointerToDBSnapshot;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldHasPointerToQAReport;
use CodeManager\Entity\Abstractions\Traits\Text\FieldJSONMetaData;
use CodeManager\Entity\Abstractions\Traits\Time\FieldRanAt;
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
    use FieldRanAt;
    use FieldDuration;
    use FieldJSONMetaData;
    use FieldHasPointerToDBSnapshot;
    use FieldHasPointerToQAReport;
    use FieldLibVersionUpdated;
    // Did the code build pass or not.
    use FieldOptional;

    public const TABLE_NAME      = 'code_builds';
    public const SORT_FIELD_TIME = 'started_at';

}
