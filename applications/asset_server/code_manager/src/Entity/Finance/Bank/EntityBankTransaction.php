<?php declare(strict_types=1);

namespace CodeManager\Entity\Finance\Bank;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldInt;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointer;
use CodeManager\Entity\Abstractions\Traits\Text\FieldTextTwo;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTime;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;

/**
 * Class EntityBankTransaction
 * @package CodeManager\Entity\Finance\Bank
 *
 * @Entity(repositoryClass="CodeManager\Repository\Finance\Bank\RepoBankTransaction")
 * @Table(name="bank_transaction")
 */
class EntityBankTransaction extends AbstractEntity {
    // Description, Details.
    use FieldTextTwo;
    // Cash amount is in pennies.
    use FieldInt;
    // The time instance that the transaction was posted.
    use FieldUnixTime;
    // A pointer to the EntityBankTransactionType.
    use FieldEntityPointer;
    // TODO: pointer to the transaction owner

    /** @var string $db_table_name */
    public static $db_table_name = 'bank_transaction';
}
