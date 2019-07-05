<?php declare(strict_types=1);

namespace QuasarSource\SQL;

use Doctrine\DBAL\DBALException;
use Doctrine\DBAL\Statement;
use QuasarSource\SQL\Enum\SQLFetchModes;

/**
 * Class UtilsSQL
 * @package QuasarSource\SQL
 */
abstract class UtilsSQL {

    /**
     * @param  Statement $statement
     * @param  string    $fetch_mode
     * @return bool|mixed|mixed[]
     * @throws DBALException
     */
    public static function execute_and_free(Statement $statement, string $fetch_mode) {
        $results = $statement->execute();
        switch ($fetch_mode) {
            case SQLFetchModes::FETCH:
                $results = $statement->fetch();
                break;
            case SQLFetchModes::FETCH_ALL:
                $results = $statement->fetchAll();
                break;
            default:
                $results = $statement->execute();
                break;
        }
        $statement->closeCursor();
        return $results;
    }

}
