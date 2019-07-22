<?php declare(strict_types=1);

namespace CodeManager\Repository\Finance\Binance;
use CodeManager\Entity\Finance\Binance\EntityBinanceOrder;
use CodeManager\Repository\Abstractions\AbstractRepo;

/**
 * Class RepoBinanceOrder
 * @package CodeManager\Repository\Finance\Binance
 */
class RepoBinanceOrder extends AbstractRepo {

    protected $entity_class   = EntityBinanceOrder::class;
    public const ENTITY_CLASS = EntityBinanceOrder::class;

}
