<?php declare(strict_types=1);

namespace CodeManager\Entity\CodeManager;
use CodeManager\Entity\Abstractions\Traits\Boolean\FieldBoolean;
use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldIntTwo;
use CodeManager\Entity\Abstractions\Traits\Text\FieldText;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTime;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityDBSnapshot
 * @package CodeManager\Entity\CodeManager
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\EntityDBSnapshotRepository")
 * @Table(name="_Code_Manager___Entity___Code_Manager___Entity_D_B_Snapshot")
 */
class EntityDBSnapshot {
    use FieldID;
    // The size of individual tables.
    use FieldText;
    // The time instance that the snapshot occurred.
    use FieldUnixTime;
    // SizeInBytes, NumElements (number of tables).
    use FieldIntTwo;
    // Did the DB schema update since the last DB snapshot.
    use FieldBoolean;


}
