<?php declare(strict_types=1);

namespace CodeManager\Repository\Finance\Bank;
use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Finance\Bank\EntityBankTransaction;
use CodeManager\Repository\Abstractions\AbstractRepository;


class EntityBankTransactionRepository extends AbstractRepository {

    #protected $default_search_attribute = 'username';
    protected $entity_class             = EntityBankTransaction::class;

    protected function event_before_remove_entity(EntityInterface $entity): void {}

}
