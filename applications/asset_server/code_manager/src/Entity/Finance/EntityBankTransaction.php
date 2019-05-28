<?php

namespace CodeManager\Entity\Finance;

use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldCashAmount;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldHasPointerToBankTransactionType;
use CodeManager\Entity\Abstractions\Traits\Text\FieldDescription;
use CodeManager\Entity\Abstractions\Traits\Text\FieldDetails;
use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Time\FieldRanAt;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityBankTransaction
 * @package CodeManager\Entity\Finance
 *
 * @ORM\Entity(repositoryClass="CodeManager\Repository\Finance\EntityBankTransactionRepository")
 * @Table(name="bank_transactions")
 */
class EntityBankTransaction {
    use FieldID;
    use FieldDescription;
    use FieldDetails;
    // Cash amount is in pennies.
    use FieldCashAmount;
    // Posted at.
    use FieldRanAt;
    use FieldHasPointerToBankTransactionType;

    public const TABLE_NAME = 'bank_transactions';

}
