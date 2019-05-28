<?php

namespace CodeManager\Entity\CodeManager;
use CodeManager\Entity\Abstractions\Traits\Boolean\FieldOptional;
use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Text\FieldJSONMetaData;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldNumElements;
use CodeManager\Entity\Abstractions\Traits\Time\FieldRanAt;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldSizeInBytes;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;
use Doctrine\ORM\Mapping\Column;


/**
 * Class EntityDBSnapshot
 * @package CodeManager\Entity\CodeManager
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\EntityDBSnapshotRepository")
 * @Table(name="db_snapshot")
 */
class EntityDBSnapshot {
    use FieldID;
    use FieldRanAt;
    use FieldSizeInBytes;
    // The number of tables.
    use FieldNumElements;
    // The size of individual tables.
    use FieldJSONMetaData;
    // Did the DB schema update since the last DB snapshot.
    use FieldOptional;

    public const TABLE_NAME      = 'db_snapshot';
    public const SORT_FIELD_TIME = 'taken_at';

}
