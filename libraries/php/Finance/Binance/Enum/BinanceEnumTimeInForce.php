<?php

namespace QuasarSource\Finance\Binance\Enum;

/**
 * Class BinanceEnumTimeInForce
 * @package QuasarSource\Finance\Binance\Enum
 *
 * @see https://help.bybit.com/hc/en-us/articles/360008388574-Time-in-Force-GTC-FOK-IOC-
 */
abstract class BinanceEnumTimeInForce {
    // good till cancelled
    public const GTC      = 'GTC';
    // fill or kill
    public const IOC      = 'IOC';
    // immediate or cancel
    public const FOK      = 'FOK';

    public const ENUM_ALL = [
        self::GTC, self::IOC, self::FOK
    ];
}
