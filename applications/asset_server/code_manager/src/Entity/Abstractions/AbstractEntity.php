<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions;

use QuasarSource\SQL\Doctrine\Fields\EnumFields;
use QuasarSource\Utils\DataType\UtilsString as STR;
use RuntimeException;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;

/**
 * Class AbstractEntity
 * @package CodeManager\Entity\Abstractions
 */
abstract class AbstractEntity {

    /** @var string $sort_field_time */
    public static $sort_field_time;

    /** @var string $db_table_name */
    public static $db_table_name;

    /** @var array $func_aliases */
    protected static $func_aliases = [];

    /**
     * @var int $id
     * @Id
     * @Column(type="integer", nullable=false, unique=true)
     * @GeneratedValue(strategy="IDENTITY")
     */
    protected $id;

    /**
     * @return int
     */
    public function getID(): int {
        return $this->id;
    }

    /**
     * @param  $name
     * @param  $arguments
     * @return mixed
     */
    public function __call($name, $arguments) {
        switch (STR::get_starts_with_match($name, EnumFields::MAGIC_METHODS)) {
            case '':
                throw new RuntimeException('Invalid function{' . $name . '} called to Entity!');
            case EnumFields::MAGIC_GET;
                $func_name = 'get' . static::$func_aliases[STR::remove($name, EnumFields::MAGIC_GET)];
                break;
            case EnumFields::MAGIC_SET:
                $func_name = 'set' . static::$func_aliases[STR::remove($name, EnumFields::MAGIC_SET)];
                break;
            default:
                throw new RuntimeException('Invalid function{' . $name . '} called to Entity!');
        }
        if ($arguments !== null && is_array($arguments) && count($arguments) !== 0) {
            return $this->$func_name($arguments[0]);
        }
        return $this->$func_name();
    }

}
