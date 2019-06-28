<?php declare(strict_types=1);

namespace QuasarSource\Finance\Binance\Enum;


abstract class BinanceEnumOrderStatus {
    public const NEW              = 'NEW';
    public const PARTIALLY_FILLED = 'PARTIALLY_FILLED';
    public const FILLED           = 'FILLED';
    public const CANCELED         = 'CANCELED';
    public const PENDING_CANCEL   = 'PENDING_CANCEL'; #(currently unused)
    public const REJECTED         = 'REJECTED';
    public const EXPIRED          = 'EXPIRED';

    public const ENUM_ALL         = [
        self::NEW, self::PARTIALLY_FILLED, self::FILLED, self::CANCELED, self::PENDING_CANCEL, self::REJECTED, self::EXPIRED
    ];
}
