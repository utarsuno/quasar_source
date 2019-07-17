<?php declare(strict_types=1);

namespace CodeManager\Repository\Finance\Bank;
use CodeManager\Entity\Finance\Bank\EntityBankTransactionType;
use CodeManager\Repository\Abstractions\AbstractRepository;

/**
 * Class RepoBankTransactionType
 * @package CodeManager\Repository\Finance\Bank
 */
class RepoBankTransactionType extends AbstractRepository {

    protected $entity_class   = EntityBankTransactionType::class;
    public const ENTITY_CLASS = EntityBankTransactionType::class;

}
