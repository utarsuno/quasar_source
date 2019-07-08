<?php declare(strict_types=1);

namespace CodeManager\Repository\Finance\Binance;
use CodeManager\Entity\Finance\Binance\EntityBinanceBalance;
use CodeManager\Repository\Abstractions\AbstractRepository;


class EntityBinanceBalanceRepository extends AbstractRepository {

    #protected $default_search_attribute = 'username';
    protected $entity_class = EntityBinanceBalance::class;

}
