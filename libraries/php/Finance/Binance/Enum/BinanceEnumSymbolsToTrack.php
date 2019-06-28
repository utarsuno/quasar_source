<?php declare(strict_types=1);

namespace QuasarSource\Finance\Binance\Enum;


abstract class BinanceEnumSymbolsToTrack {
    public const IOTA = 'IOTA';
    public const BNB  = 'BNB';
    public const ETH  = 'ETH';
    public const BTC  = 'BTC';
    public const BAT  = 'BAT';

    public const ENUM_ALL = [
        self::IOTA, self::BNB, self::ETH, self::BTC, self::BAT
    ];
}
