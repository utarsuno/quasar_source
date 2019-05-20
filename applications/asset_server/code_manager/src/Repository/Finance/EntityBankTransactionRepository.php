<?php

namespace CodeManager\Repository\Finance;
use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Finance\EntityBankTransaction;
use CodeManager\Repository\Abstractions\AbstractRepository;


class EntityBankTransactionRepository extends AbstractRepository {

    #protected $default_search_attribute = 'username';
    protected $entity_class             = EntityBankTransaction::class;

    protected function event_before_remove_entity(EntityInterface $entity): void {}

}