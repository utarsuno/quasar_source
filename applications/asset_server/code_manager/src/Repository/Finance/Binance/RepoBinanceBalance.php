<?php declare(strict_types=1);

namespace CodeManager\Repository\Finance\Binance;
use CodeManager\Entity\Finance\Binance\EntityBinanceBalance;
use CodeManager\Repository\Abstractions\AbstractRepository;

/**
 * Class RepoBinanceBalance
 * @package CodeManager\Repository\Finance\Binance
 */
class RepoBinanceBalance extends AbstractRepository {

    protected $entity_class   = EntityBinanceBalance::class;
    public const ENTITY_CLASS = EntityBinanceBalance::class;

}
