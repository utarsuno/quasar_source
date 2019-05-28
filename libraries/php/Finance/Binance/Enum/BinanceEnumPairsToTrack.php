<?php

namespace QuasarSource\Finance\Binance\Enum;
use QuasarSource\Finance\Binance\Enum\BinanceEnumSymbolsToTrack as COIN;


abstract class BinanceEnumPairsToTrack {
    public const IOTA_TO_BTC = COIN::IOTA . COIN::BTC;
    public const ENUM_ALL    = [self::IOTA_TO_BTC];
}
