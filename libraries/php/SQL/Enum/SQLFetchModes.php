<?php declare(strict_types=1);

namespace QuasarSource\SQL\Enum;

/**
 * Class SQLFunctions
 * @package QuasarSource\SQL\Enum
 */
abstract class SQLFetchModes {
    public const FETCH     = 'fetch';
    public const FETCH_ALL = 'fetch_all';
    public const FETCH_NUM = 'fetch_num';
}
