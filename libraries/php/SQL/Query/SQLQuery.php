<?php declare(strict_types=1);

namespace QuasarSource\SQL\Representation;

use QuasarSource\Utils\DataType\UtilsString as STR;

/**
 * Class SQLQuery
 * @package QuasarSource\SQL\Representation
 */
final class SQLQuery extends SQLQueryRaw {
    public const ATTRIBUTE_SELF_NAME = 'a0{SELF_NAME}';
    public const ATTRIBUTE_SELF_TYPE = 'a1{SELF_TYPE}';

    public const VAL_TYPE_SCHEMA     = 'schema';
    public const VAL_TYPE_TABLE      = 'table';

    /** @var InterfaceSQLQueryOwner $query_owner */
    private $query_owner;

    /**
     * SQLQuery constructor.
     * @param InterfaceSQLQueryOwner $query_owner
     */
    public function __construct(InterfaceSQLQueryOwner $query_owner=null) {
        $this->query_owner = $query_owner;
    }

    public function __destruct() {
        parent::__destruct();
        unset($this->query_owner);
    }

    /**
     * @param  string $of
     * @return mixed
     */
    public function PRETTY_SIZE(string $of): self {
        return $this->raw_add(' pg_size_pretty(' . $of . ')');
    }

    /**
     * @param  string $fields_to_count
     * @return mixed
     */
    public function COUNT($fields_to_count='*'): self {
        return $this->raw_add('COUNT(' . $fields_to_count . ')');
    }

    /**
     * @param  $limit
     * @return mixed
     */
    public function LIMIT($limit=1): self {
        return $this->raw_add(' LIMIT ' . ((string) $limit));
    }

    /*___  __   __
     |__  |__) /  \  |\/|
     |    |  \ \__/  |  | */

    /**
     * @param string $from
     * @return mixed
     */
    public function FROM(string $from): self {
        return $this->raw_add('FROM ' . $from);
    }

    /**
     * @return mixed
     */
    public function FROM_SELF(): self {
        return $this->FROM($this->get_owner_name());
    }

    /*__   __   __   ___  __      __
     /  \ |__) |  \ |__  |__)    |__) \ /
     \__/ |  \ |__/ |___ |  \    |__)  |  */

    /**
     * @param string $field
     * @return mixed
     */
    public function ORDER_BY(string $field): self {
        return $this->raw_add(' ORDER BY ' . $field);
    }

    /**
     * @return mixed
     */
    public function DESC(): self {
        return $this->raw_add(' DESC');
    }

    /**
     * @return mixed
     */
    public function ASC(): self {
        return $this->raw_add(' ASC');
    }

    /**
     * @param $field
     * @return mixed
     */
    public function ASCENDING_ON($field): self {
        return $this->ORDER_BY($field)->ASC();
    }

    /**
     * @param $field
     * @return mixed
     */
    public function DESCENDING_ON($field): self {
        return $this->ORDER_BY($field)->DESC();
    }

    /*          ___  __   ___
     |  | |__| |__  |__) |__
     |/\| |  | |___ |  \ |___ */

    /**
     * @return mixed
     */
    public function WHERE(): self {
        return $this->raw_add(' WHERE');
    }

    /**
     * @param  $field
     * @return mixed
     */
    public function WHERE_EQUAL_TO_SELF($field): self {
        return $this->WHERE()->EQUAL_TO($field, $this->get_owner_name());
    }

    /**
     * @param  $fields
     * @param  $values
     * @return mixed
     */
    public function WHERE_EQUAL_TO($fields, $values): self {
        return $this->WHERE()->EQUAL_TO($fields, $values);
    }

    /**
     * @param  string $field
     * @param  string $value
     * @return mixed
     */
    public function WHERE_EQUAL_TO_STR(string $field, string $value): self {
        return $this->WHERE()->EQUAL_TO_STR($field, $value);
    }

    /**
     * @param  $field
     * @param  $value
     * @return mixed
     */
    public function AND_EQUAL_TO_STR($field, string $value): self {
        $this->sql .= 'AND ';
        return $this->EQUAL_TO_STR($field, $value);
    }

    /*___  __                    ___  __
     |__  /  \ |  |  /\  |        |  /  \
     |___ \__X \__/ /~~\ |___     |  \__/ */

    /**
     * @param  $fields
     * @param  $values
     * @return mixed
     */
    public function EQUAL_TO($fields, $values): self {
        if (is_string($fields) && is_string($values)) {
            $this->sql .= $fields . ' = '. $values . ' ';
        }
        return $this;
    }

    /**
     * @param  string $field
     * @param  string $value
     * @return mixed
     */
    public function EQUAL_TO_STR(string $field, string $value): self {
        $this->sql .= $field . ' = '. STR::in_quotes($value) . ' ';
        return $this;
    }

    /*__   ___       ___  __  ___
     /__` |__  |    |__  /  `  |
     .__/ |___ |___ |___ \__,  | */

    /**
     * @param  string $fields
     * @param  string $from
     * @return mixed
     */
    public function SELECT_COUNT_FROM(string $fields, string $from): self {
        $this->sql          .= 'SELECT COUNT(' . $fields . ') FROM ' . $from . ' ';
        $this->is_multi_col  = false;
        $this->is_multi_row  = false;
        return $this;
    }

    /**
     * @param  string $field
     * @param  string $as
     * @return mixed
     */
    public function SELECT_AS(string $field, string $as): self {
        $this->SELECT($field);
        $this->sql .= ' AS ' . $as . ' ';
        return $this;
    }

    /**
     * @return mixed
     */
    public function SELECT_ALL(): self {
        $this->is_multi_col = true;
        return $this->raw_add('SELECT *');
    }

    /**
     * @param  null $optional_fields
     * @return mixed
     */
    public function SELECT($optional_fields = null): self {
        $this->sql .= 'SELECT ';
        if ($optional_fields !== null) {
            if (is_string($optional_fields)) {
                $this->is_multi_col = false;
                $this->sql         .= $optional_fields . ' ';
            } else if (is_array($optional_fields)) {
                $num_fields         = count($optional_fields);
                $this->is_multi_col = $num_fields > 1;
                if ($num_fields > 0) {
                    foreach ($optional_fields as $field) {
                        $this->sql .= ', ' . $field;
                    }
                    $this->sql .= implode(',', $optional_fields);
                    var_dump($this->sql);
                    $this->sql = STR::remove_last_n($this->sql, 2);
                    var_dump($this->sql);
                    exit(2);
                    #$this->sql = StringUtilities::indexed()
                }
            }
        }
        return $this;
    }

    # ----------------------------------------------- S Q L -- O W N E R -----------------------------------------------

    /**
     * @param  bool $use_single_quotes
     * @return string
     */
    public function get_owner_name(bool $use_single_quotes=false): string {
        return STR::in_quotes($this->query_owner->get_attribute(self::ATTRIBUTE_SELF_NAME), $use_single_quotes);
    }

    /**
     * @return string
     */
    public function get_owner_type(): string {
        return $this->query_owner->get_attribute(self::ATTRIBUTE_SELF_TYPE);
    }

    /**
     * @return bool
     */
    public function owner_is_table(): bool {
        return $this->get_owner_type() === self::VAL_TYPE_TABLE;
    }

    /**
     * @return bool
     */
    public function owner_is_schema(): bool {
        return $this->get_owner_type() === self::VAL_TYPE_SCHEMA;
    }

}
