<?php

namespace QuasarSource\Finance\Binance\Enum;


abstract class BinanceEnumOrderSide {
    public const BUY      = 'BUY';
    public const SELL     = 'SELL';

    public const ENUM_ALL = [
        self::BUY, self::SELL
    ];
}
