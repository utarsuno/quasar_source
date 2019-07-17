<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions;

use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;

/**
 * Class AbstractEntity
 * @package CodeManager\Entity\Abstractions
 */
abstract class AbstractEntity {
    use FieldID;

    /** @var string $sort_field_time */
    public static $sort_field_time;

    /** @var string $db_table_name */
    public static $db_table_name;

}
