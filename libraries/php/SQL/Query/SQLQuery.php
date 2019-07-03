<?php declare(strict_types=1);

namespace QuasarSource\SQL\Representation;

use QuasarSource\SQL\Enum\SQLFunctions;
use QuasarSource\Utilities\UtilsString as STR;

/**
 * Class SQLQuery
 * @package QuasarSource\SQL\Representation
 */
final class SQLQuery extends SQLQueryRaw {
    public const ATTRIBUTE_SELF_NAME = 'a0{SELF_NAME}';
    public const ATTRIBUTE_SELF_TYPE = 'a1{SELF_TYPE}';

    public const VAL_TYPE_SCHEMA     = 'schema';
    public const VAL_TYPE_TABLE      = 'table';

    /** @var string $previous_function_call */
    private $previous_function_call;

    /** @var InterfaceSQLQueryOwner $query_owner */
    private $query_owner;

    /**
     * SQLQuery constructor.
     * @param InterfaceSQLQueryOwner $query_owner
     */
    public function __construct(InterfaceSQLQueryOwner $query_owner=null) {
        $this->query_owner = $query_owner;
    }

    /**
     * @param string $fields_to_count
     * @return mixed
     */
    public function COUNT($fields_to_count='*'): self {
        return $this->raw_add('COUNT(' . $fields_to_count . ')');
    }

    /**
     * @param $limit
     * @return mixed
     */
    public function LIMIT($limit=1): self {
        return $this->raw_add(' LIMIT ' . ((string) $limit));
    }

    /**
     * @param string $function_name
     * @param $value
     * @return mixed
     */
    public function FUNC(string $function_name, $value): self {
        return $this->raw_add(STR::parentheses($function_name, $value));
    }

    /**
     * @return mixed
     */
    public function ANALYZE_DB(): self {
        return $this->raw_set('ANALYZE VERBOSE');
    }

    /**
     * @param string $table_name
     * @return mixed
     */
    public function ANALYZE_TABLE(string $table_name): self {
        return $this->ANALYZE_DB()->raw_add(' ' . $this->get_owner_name() . '.\'' . $table_name . '\'');
    }

    /*__    __  ___
     /__` |  / |__
     .__/ | /_ |___ */

    /**
     * @param bool $pretty_output
     * @return mixed
     */
    public function SIZE_OF_SELF(bool $pretty_output): self {
        $owner_type = $this->get_owner_type();
        $sql        = '(' . $this->get_owner_name() . ')';
        if ($owner_type === self::VAL_TYPE_TABLE) {
            $sql = SQLFunctions::SIZE_OF_TABLE . $sql;
        }
        if ($owner_type === self::VAL_TYPE_SCHEMA) {
            $sql = SQLFunctions::SIZE_OF_DB . $sql;
        }
        if ($pretty_output) {
            return $this->raw_add(SQLFunctions::SIZE_OF_OUTPUT_MADE_PRETTY . '(' . $sql . ')');
        }
        return $this->raw_add($sql);
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
     * @return SQLQuery
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

    /**
     * @param string $field
     * @return SQLQuery
     */
    public function ORDER_BY_DESC(string $field): self {
        return $this->ORDER_BY($field)->DESC();
    }

    /**
     * @param string $field
     * @return SQLQuery
     */
    public function ORDER_BY_ASC(string $field): self {
        return $this->ORDER_BY($field)->ASC();
    }

    /**
     * @param string $field
     * @param $limit
     * @return SQLQuery
     */
    public function ORDER_BY_DESC_LIMIT(string $field, $limit=1): self {
        $this->sql .= ' ORDER BY ' . $field . ' DESC ';
        return $this->LIMIT($limit);
        #return $this->ORDER_BY_DESC()->LIMIT()
    }

    /**
     * @param string $field
     * @param $limit
     * @return SQLQuery
     */
    public function ORDER_BY_ASC_LIMIT(string $field, $limit=1): self {
        $this->sql .= ' ORDER BY ' . $field . ' ASC ' . ((string) $limit) . ' ';
        return $this->LIMIT($limit);
    }

    /*          ___  __   ___
     |  | |__| |__  |__) |__
     |/\| |  | |___ |  \ |___ */

    /**
     * @return mixed
     */
    public function WHERE(): self {
        # TODO: NOTE: Temporary lazy design, works for now but will break once generated queries reach a certain complexity.
        $this->expecting_multiple_rows();
        return $this->raw_add(' WHERE');
    }

    /**
     * @param $field
     * @return SQLQuery
     */
    public function WHERE_EQUAL_TO_SELF($field): self {
        return $this->WHERE()->EQUAL_TO($field, $this->get_owner_name());
    }

    /**
     * @param $fields
     * @param $values
     * @return SQLQuery
     */
    public function WHERE_EQUAL_TO($fields, $values): self {
        return $this->WHERE()->EQUAL_TO($fields, $values);
    }

    /**
     * @param string $field
     * @param string $value
     * @return SQLQuery
     */
    public function WHERE_EQUAL_TO_STR(string $field, string $value): self {
        return $this->WHERE()->EQUAL_TO_STR($field, $value);
    }

    /**
     * @param $field
     * @param $value
     * @return SQLQuery
     */
    public function AND_EQUAL_TO_STR($field, string $value): self {
        $this->sql .= 'AND ';
        return $this->EQUAL_TO_STR($field, $value);
    }

    /*___  __                    ___  __
     |__  /  \ |  |  /\  |        |  /  \
     |___ \__X \__/ /~~\ |___     |  \__/ */

    /**
     * @param $fields
     * @param $values
     * @return SQLQuery
     */
    public function EQUAL_TO($fields, $values): self {
        if (is_string($fields) && is_string($values)) {
            $this->sql .= $fields . ' = '. $values . ' ';
        }
        return $this;
    }

    /**
     * @param string $field
     * @param string $value
     * @return SQLQuery
     */
    public function EQUAL_TO_STR(string $field, string $value): self {
        $this->sql .= $field . ' = '. STR::in_quotes($value) . ' ';
        return $this;
    }

    /*__   ___       ___  __  ___
     /__` |__  |    |__  /  `  |
     .__/ |___ |___ |___ \__,  | */

    /**
     * @param string $fields
     * @param string $from
     * @return SQLQuery
     */
    public function SELECT_COUNT_FROM(string $fields, string $from): self {
        $this->sql              .= 'SELECT COUNT(' . $fields . ') FROM ' . $from . ' ';
        $this->response_num_cols = 1;
        $this->response_num_rows = 1;
        return $this;
    }

    /**
     * @param string $field
     * @return SQLQuery
     */
    public function SELECT_COUNT_FROM_SELF(string $field): self {
        $this->sql              .= 'SELECT COUNT(' . $field . ') FROM ' . STR::remove($this->get_owner_name(), '\'') . ' ';
        $this->response_num_cols = 1;
        $this->response_num_rows = 1;
        return $this;
    }

    /**
     * @param string $field
     * @param string $as
     * @return SQLQuery
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
        return $this->raw_add('SELECT *');
    }

    /**
     * @param null $optional_fields
     * @return SQLQuery
     */
    public function SELECT($optional_fields = null): self {
        $this->sql .= 'SELECT ';
        if ($optional_fields !== null) {
            if (is_string($optional_fields)) {
                $this->response_num_cols = 1;
                $this->sql              .= $optional_fields . ' ';
            } else if (is_array($optional_fields)) {
                $this->response_num_cols = count($optional_fields);
                if ($this->response_num_cols > 0) {
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
     * @return string
     */
    public function get_owner_name(): string {
        return STR::in_quotes($this->query_owner->get_attribute(self::ATTRIBUTE_SELF_NAME));
    }

    /**
     * @return string
     */
    public function get_owner_type(): string {
        return $this->query_owner->get_attribute(self::ATTRIBUTE_SELF_TYPE);
    }

}
