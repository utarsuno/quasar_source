<?php declare(strict_types=1);

namespace QuasarSource\Finance\Binance\Enum;

/**
 * Class BinanceEnumTimeInForce
 * @package QuasarSource\Finance\Binance\Enum
 *
 * @see https://help.bybit.com/hc/en-us/articles/360008388574-Time-in-Force-GTC-FOK-IOC-
 */
abstract class BinanceEnumTimeInForce {
    // good till cancelled
    public const GOOD_TILL_CANCELLED  = 'GTC';
    // fill or kill
    public const IMMEDIATE_OR_CANCEL  = 'IOC';
    // immediate or cancel
    public const FORK_OR_KILL         = 'FOK';

    public const ENUM_ALL = [
        self::GOOD_TILL_CANCELLED, self::IMMEDIATE_OR_CANCEL, self::FORK_OR_KILL
    ];
}
