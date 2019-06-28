<?php declare(strict_types=1);

namespace QuasarSource\Finance\Binance\Enum;


abstract class BinanceEnumAPIKeys {
    public const API    = 'api_key';
    public const SECRET = 'api_secret';

    public const ENUM_ALL = [
        self::API, self::SECRET
    ];
}
