<?php declare(strict_types=1);

namespace CodeManager\Entity\CodeManager;
use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Boolean\FieldBoolean;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldIntThree;
use CodeManager\Entity\Abstractions\Traits\Text\FieldBigTextTwo;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTime;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTimestamp;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;

/**
 * Class EntityDBSnapshot
 * @package CodeManager\Entity\CodeManager
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\RepoSnapshotDB")
 * @Table(name="snapshot_db")
 */
class EntitySnapshotDB extends AbstractEntity {
    // The size of individual tables, output of schema update command (if any present)
    use FieldBigTextTwo;
    // The time instance that the snapshot occurred.
    use FieldUnixTime;
    use FieldUnixTimestamp;
    // SizeInBytes, NumElements{NumTables}, MigrationVersion.
    use FieldIntThree;
    // Did the DB schema update since the last DB snapshot.
    use FieldBoolean;

    public static $sort_field_time = 'unix_timestamp0';

    /** @var string $db_table_name */
    public static $db_table_name = 'snapshot_db';

    public function __construct() {
        $this->set_did_db_schema_update(false);
    }

    /**
     * @param  bool $db_schema_updated
     * @return EntitySnapshotDB
     */
    public function set_did_db_schema_update(bool $db_schema_updated): self {
        return $this->setBooleanValue0($db_schema_updated);
    }

    /**
     * @param  int $version
     * @return EntitySnapshotDB
     */
    public function set_migration_version(int $version): self {
        return $this->setInt2($version);
    }

    /**
     * @param  string $output
     * @return EntitySnapshotDB
     */
    public function set_schema_command_output(string $output): self {
        return $this->setBlob1($output);
    }

    /**
     * @return string
     */
    public function get_schema_command_output(): string {
        return $this->getBlob1();
    }

    /**
     * @param  array $report
     * @return EntitySnapshotDB
     */
    public function set_report(array $report): self {
        return $this->setBlob0(json_encode($report));
    }

    /**
     * @param  int $num_tables
     * @return EntitySnapshotDB
     */
    public function set_num_tables(int $num_tables): self {
        return $this->setInt1($num_tables);
    }

    /**
     * @param  int $bytes
     * @return EntitySnapshotDB
     */
    public function set_size_in_bytes(int $bytes): self {
        return $this->setInt0($bytes);
    }
}
