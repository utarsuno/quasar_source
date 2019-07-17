<?php declare(strict_types=1);

namespace CodeManager\Entity\Finance\Bank;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Text\FieldTextTwo;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;

/**
 * Class EntityBankTransactionType
 * @package CodeManager\Entity\Finance\Bank
 *
 * @Entity(
 *     repositoryClass="CodeManager\Repository\Finance\Bank\RepoBankTransactionType",
 *     readOnly=true
 * )
 * @Table(name="bank_transaction_type")
 */
class EntityBankTransactionType extends AbstractEntity {
    // Description of the transaction type, sub-state.
    use FieldTextTwo;

    /** @var string $db_table_name */
    public static $db_table_name = 'bank_transaction_type';
}
