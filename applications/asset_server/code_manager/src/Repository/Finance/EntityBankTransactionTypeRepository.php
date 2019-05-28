<?php

namespace CodeManager\Repository\Finance;
use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Finance\EntityBankTransactionType;
use CodeManager\Repository\Abstractions\AbstractRepository;


class EntityBankTransactionTypeRepository extends AbstractRepository {

    #protected $default_search_attribute = 'username';
    protected $entity_class             = EntityBankTransactionType::class;

    protected function event_before_remove_entity(EntityInterface $entity): void {}

}