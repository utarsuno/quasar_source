<?php

namespace CodeManager\Entity\Finance;

use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Text\FieldName;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityBankTransaction
 * @package CodeManager\Entity\Finance
 *
 * @ORM\Entity(repositoryClass="CodeManager\Repository\Finance\EntityBankTransactionTypeRepository")
 * @Table(name="bank_transaction_types")
 */
class EntityBankTransactionType {
    use FieldID;
    use FieldName;

    public const TABLE_NAME = 'bank_transaction_types';
}
