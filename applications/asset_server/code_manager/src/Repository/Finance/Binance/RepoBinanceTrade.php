<?php declare(strict_types=1);

namespace CodeManager\Repository\Finance\Binance;
use CodeManager\Entity\Finance\Binance\EntityBinanceTrade;
use CodeManager\Repository\Abstractions\AbstractRepo;

/**
 * Class RepoBinanceTrade
 * @package CodeManager\Repository\Finance\Binance
 */
class RepoBinanceTrade extends AbstractRepo {

    protected $entity_class   = EntityBinanceTrade::class;

}
