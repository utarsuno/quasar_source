<?php declare(strict_types=1);

namespace QuasarSource\Finance\Binance\Enum;


abstract class BinanceEnumSymbolStatus {
    public const PRE_TRADING   = 'PRE_TRADING';
    public const TRADING       = 'TRADING';
    public const POST_TRADING  = 'POST_TRADING';
    public const END_OF_DAY    = 'END_OF_DAY';
    public const HALT          = 'HALT';
    public const AUCTION_MATCH = 'AUCTION_MATCH';
    public const BREAK         = 'BREAK';

    public const ENUM_ALL      = [
        self::PRE_TRADING, self::TRADING, self::POST_TRADING, self::END_OF_DAY, self::HALT, self::AUCTION_MATCH, self::BREAK
    ];
}