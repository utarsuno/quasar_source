<?php declare(strict_types=1);

namespace CodeManager\Entity\CodeManager;

use CodeManager\Entity\Abstractions\AbstractEntity;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\SQL\Doctrine\Entity\Field\Boolean\TraitBool0;
use QuasarSource\SQL\Doctrine\Entity\Field\Number\Int\Byte\TraitSizeInBytes;
use QuasarSource\SQL\Doctrine\Entity\Field\Number\Int\Small\TraitSmallInt1;
use QuasarSource\SQL\Doctrine\Entity\Field\Text\Blob\TraitBigText2;
use QuasarSource\SQL\Doctrine\Entity\Field\Time\TraitUnixTime0;
use QuasarSource\SQL\Doctrine\Fields\EnumFields as FIELD;

/**
 * Class EntityDBSnapshot
 * @package CodeManager\Entity\CodeManager
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\RepoSnapshotDB")
 * @Table(name="snapshot_db")
 *
 * @method EntitySnapshotDB set_report($report)
 * @method EntitySnapshotDB set_schema_cmd_output($output)
 * @method EntitySnapshotDB set_schema_cmd_errors($errors)
 * @method EntitySnapshotDB set_size_in_bytes(int $size_in_bytes)
 * @method EntitySnapshotDB set_number_of_tables(int $number_of_tables)
 * @method EntitySnapshotDB set_migration_version(int $migration_version)
 * @method EntitySnapshotDB set_timestamp(int $timestamp)
 * @method EntitySnapshotDB set_schema_updated(bool $b)
 * @method string|null get_report()
 * @method string|null get_schema_cmd_output()
 * @method string|null get_schema_cmd_errors()
 * @method int|null get_size_in_bytes()
 * @method int|null get_number_of_tables()
 * @method int|null get_migration_version()
 * @method int|null get_timestamp()
 * @method boolean|null get_schema_updated()
 */
class EntitySnapshotDB extends AbstractEntity {
    use TraitSizeInBytes;
    // {size of tables, output of schema update cmd, errors of schema update cmd}
    use TraitBigText2;
    // {number of tables, migration version}
    use TraitSmallInt1;
    // {did DB Schema update}
    use TraitBool0;
    // {time instance that the snapshot occurred}
    use TraitUnixTime0;

    public static $sort_field_time = FIELD::UNIX_TIME_0_AS_SQL;
    public static $db_table_name   = 'snapshot_db';
    protected static $func_aliases = [
        'report'            => FIELD::BIG_TEXT_0,
        'schema_cmd_output' => FIELD::BIG_TEXT_1,
        'schema_cmd_errors' => FIELD::BIG_TEXT_2,
        'size_in_bytes'     => FIELD::SIZE_IN_BYTES,
        'number_of_tables'  => FIELD::SMALL_INT_0,
        'migration_version' => FIELD::SMALL_INT_1,
        'schema_updated'    => FIELD::BOOLEAN_0,
        'timestamp'         => FIELD::UNIX_TIME_0
    ];

    public function __construct() {
        $this->set_schema_updated(false);
    }

}
