<?php declare(strict_types=1);

namespace CodeManager\Repository\Finance\Binance;
use CodeManager\Entity\Finance\Binance\EntityBinanceTrade;
use CodeManager\Repository\Abstractions\AbstractRepository;

/**
 * Class RepoBinanceTrade
 * @package CodeManager\Repository\Finance\Binance
 */
class RepoBinanceTrade extends AbstractRepository {

    protected $entity_class   = EntityBinanceTrade::class;
    public const ENTITY_CLASS = EntityBinanceTrade::class;

}
