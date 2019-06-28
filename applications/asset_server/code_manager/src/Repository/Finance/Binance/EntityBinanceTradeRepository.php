<?php declare(strict_types=1);

namespace CodeManager\Repository\Finance\Binance;
use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Finance\Binance\EntityBinanceTrade;
use CodeManager\Repository\Abstractions\AbstractRepository;


class EntityBinanceTradeRepository extends AbstractRepository {

    #protected $default_search_attribute = 'username';
    protected $entity_class = EntityBinanceTrade::class;

    protected function event_before_remove_entity(EntityInterface $entity): void {}

}
