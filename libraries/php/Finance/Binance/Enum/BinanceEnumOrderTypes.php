<?php

namespace QuasarSource\Finance\Binance\Enum;


abstract class BinanceEnumOrderTypes {
    public const LIMIT             = 'LIMIT';
    public const MARKET            = 'MARKET';
    public const STOP_LOSS         = 'STOP_LOSS';
    public const STOP_LOSS_LIMIT   = 'STOP_LOSS_LIMIT';
    public const TAKE_PROFIT       = 'TAKE_PROFIT';
    public const TAKE_PROFIT_LIMIT = 'TAKE_PROFIT_LIMIT';
    public const LIMIT_MAKER       = 'LIMIT_MAKER';

    public const ENUM_ALL          = [
        self::LIMIT, self::MARKET, self::STOP_LOSS, self::STOP_LOSS_LIMIT, self::TAKE_PROFIT, self::TAKE_PROFIT_LIMIT, self::LIMIT_MAKER
    ];
}
