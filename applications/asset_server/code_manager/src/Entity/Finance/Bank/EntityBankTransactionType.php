<?php declare(strict_types=1);

namespace CodeManager\Entity\Finance\Bank;

use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Text\FieldText;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityBankTransactionType
 * @package CodeManager\Entity\Finance\Bank
 *
 * @ORM\Entity(repositoryClass="CodeManager\Repository\Finance\Bank\EntityBankTransactionTypeRepository")
 * @Table(name="_Code_Manager___Entity___Finance___Bank___Entity_Bank_Transaction_Type")
 */
class EntityBankTransactionType {
    use FieldID;
    use FieldText;
}
