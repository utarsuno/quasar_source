<?php declare(strict_types=1);

namespace QuasarSource\Finance\Binance\Enum;
use QuasarSource\Finance\Binance\Enum\BinanceEnumSymbolsToTrack as COIN;


abstract class BinanceEnumPairsToTrack {
    public const IOTA_TO_BTC = COIN::IOTA . COIN::BTC;
    public const BAT_TO_BTC  = COIN::BAT  . COIN::BTC;
    public const ENUM_ALL    = [self::IOTA_TO_BTC, self::BAT_TO_BTC];
}
