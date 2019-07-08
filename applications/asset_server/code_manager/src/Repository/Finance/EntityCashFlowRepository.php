<?php declare(strict_types=1);

namespace CodeManager\Repository\Finance;
use CodeManager\Entity\Finance\EntityCashFlow;
use CodeManager\Repository\Abstractions\AbstractRepository;


class EntityCashFlowRepository extends AbstractRepository {

    #protected $default_search_attribute = 'username';
    protected $entity_class             = EntityCashFlow::class;

}