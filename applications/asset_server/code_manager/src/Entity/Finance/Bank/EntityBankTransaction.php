<?php declare(strict_types=1);

namespace CodeManager\Entity\Finance\Bank;

use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldInt;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointer;
use CodeManager\Entity\Abstractions\Traits\Text\FieldTextTwo;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTime;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityBankTransaction
 * @package CodeManager\Entity\Finance\Bank
 *
 * @ORM\Entity(repositoryClass="CodeManager\Repository\Finance\Bank\EntityBankTransactionRepository")
 * @Table(name="_Code_Manager___Entity___Finance___Bank___Entity_Bank_Transction")
 */
class EntityBankTransaction {
    use FieldID;
    // Description, Details.
    use FieldTextTwo;
    // Cash amount is in pennies.
    use FieldInt;
    // The time instance that the transaction was posted.
    use FieldUnixTime;
    // A pointer to the EntityBankTransactionType.
    use FieldEntityPointer;

}
