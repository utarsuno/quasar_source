<?php

namespace CodeManager\Repository\Finance;
use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Finance\EntityCashFlow;
use CodeManager\Repository\Abstractions\AbstractRepository;


class EntityCashFlowRepository extends AbstractRepository {

    #protected $default_search_attribute = 'username';
    protected $entity_class             = EntityCashFlow::class;

    protected function event_before_remove_entity(EntityInterface $entity): void {}

}