<?php declare(strict_types=1);

namespace CodeManager\Entity\CodeManager;
use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Boolean\FieldBoolean;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldIntTwo;
use CodeManager\Entity\Abstractions\Traits\Text\FieldBigText;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTime;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTimestamp;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityDBSnapshot
 * @package CodeManager\Entity\CodeManager
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\EntityDBSnapshotRepository")
 * @Table(name="db_snapshot")
 */
class EntityDBSnapshot extends AbstractEntity {
    // The size of individual tables.
    use FieldBigText;
    // The time instance that the snapshot occurred.
    use FieldUnixTime;
    use FieldUnixTimestamp;
    // SizeInBytes, NumElements (number of tables).
    use FieldIntTwo;
    // Did the DB schema update since the last DB snapshot.
    use FieldBoolean;

    public static $sort_field_time = 'unix_timestamp0';

    public function __construct() {
        $this->set_did_db_schema_update(false);
    }

    /**
     * @param  bool $db_schema_updated
     * @return EntityDBSnapshot
     */
    public function set_did_db_schema_update(bool $db_schema_updated): self {
        return $this->setBooleanValue0($db_schema_updated);
    }

    /**
     * @param  array $report
     * @return EntityDBSnapshot
     */
    public function set_report(array $report): self {
        return $this->setBlob0(json_encode($report));
    }

    /**
     * @param  int $num_tables
     * @return EntityDBSnapshot
     */
    public function set_num_tables(int $num_tables): self {
        return $this->setInt1($num_tables);
    }

    /**
     * @param  int $bytes
     * @return EntityDBSnapshot
     */
    public function set_size_in_bytes(int $bytes): self {
        return $this->setInt0($bytes);
    }
}
