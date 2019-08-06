<?php declare(strict_types=1);

namespace CodeManager\Repository\Finance\Binance;
use CodeManager\Entity\Finance\Binance\EntityBinanceBalance;
use CodeManager\Repository\Abstractions\AbstractRepo;

/**
 * Class RepoBinanceBalance
 * @package CodeManager\Repository\Finance\Binance
 */
class RepoBinanceBalance extends AbstractRepo {

    protected $entity_class = EntityBinanceBalance::class;

}
