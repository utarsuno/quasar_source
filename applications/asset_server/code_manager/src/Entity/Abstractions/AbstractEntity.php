<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions;

use QuasarSource\Doctrine\Fields\EnumFields;
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
        $match = STR::get_starts_with_match($name, EnumFields::MAGIC_METHODS);
        switch ($match) {
            case EnumFields::MAGIC_GET:
            case EnumFields::MAGIC_GET_ALT:
                $func_name = 'get' . static::$func_aliases[STR::remove($name, $match)];
                break;
            case EnumFields::MAGIC_SET:
            case EnumFields::MAGIC_SET_ALT:
                $func_name = 'set' . static::$func_aliases[STR::remove($name, $match)];
                break;
            case '':
            default:
                throw new RuntimeException('Invalid function{' . $name . '} called to Entity, default branch!');
                break;
        }
        if ($arguments !== null && is_array($arguments)) {
            $num_args = count($arguments);
            if ($num_args === 1) {
                return $this->$func_name($arguments[0]);
            }
            if ($num_args === 0) {
                return $this->$func_name();
            }
            throw new RuntimeException('Invalid number of arguments (or not supported)');
        }
        return $this->$func_name();
    }

}
