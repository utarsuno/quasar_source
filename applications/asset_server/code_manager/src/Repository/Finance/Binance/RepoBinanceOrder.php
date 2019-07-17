<?php declare(strict_types=1);

namespace CodeManager\Repository\Finance\Binance;
use CodeManager\Entity\Finance\Binance\EntityBinanceOrder;
use CodeManager\Repository\Abstractions\AbstractRepository;

/**
 * Class RepoBinanceOrder
 * @package CodeManager\Repository\Finance\Binance
 */
class RepoBinanceOrder extends AbstractRepository {

    protected $entity_class   = EntityBinanceOrder::class;
    public const ENTITY_CLASS = EntityBinanceOrder::class;

}
