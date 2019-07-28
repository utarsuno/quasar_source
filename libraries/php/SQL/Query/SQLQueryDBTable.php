<?php declare(strict_types=1);

namespace QuasarSource\SQL\Representation;

use QuasarSource\Utils\DataType\UtilsString as STR;

/**
 * Class SQLQueryDBTable
 * @package QuasarSource\SQL\Representation
 */
class SQLQueryDBTable extends SQLQuery {

    /**
     * @param InterfaceSQLQueryOwner $query_owner
     */
    public function __construct(InterfaceSQLQueryOwner $query_owner=null) {
        parent::__construct($query_owner);
    }



}
