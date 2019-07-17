<?php declare(strict_types=1);

namespace CodeManager\Entity\Finance;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldIntTwo;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointerTwo;
use CodeManager\Entity\Abstractions\Traits\Text\FieldText;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTime;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTimestamp;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;

/**
 * Class EntityCashFlow
 * @package CodeManager\Entity\Finance
 *
 * @Entity(repositoryClass="CodeManager\Repository\Finance\RepoCashFlow")
 * @Table(name="cash_flow")
 */
class EntityCashFlow extends AbstractEntity {
    // Description
    use FieldText;
    // 0 --> VendorToVendor, 1 --> VendorToUser, 2 --> UserToUser, 3 --> UserToVendor
    // Amount.
    use FieldIntTwo;
    // A pointer from Entity and pointer to Entity.
    use FieldEntityPointerTwo;
    // Optional, time of transaction.
    use FieldUnixTime;
    use FieldUnixTimestamp;

    // TODO: TRANSACTION TYPE

    /** @var string $db_table_name */
    public static $db_table_name = 'cash_flow';

    /**
     * @param  int $amount
     * @return EntityCashFlow
     */
    public function set_amount(int $amount): self {
        return $this->setInt1($amount);
    }

    /**
     * @return int
     */
    public function get_amount(): int {
        return $this->getInt1();
    }

    /**
     * @param  int $type
     * @return EntityCashFlow
     */
    public function set_transaction_type(int $type): self {
        return $this->setInt0($type);
    }

    /**
     * @return string
     */
    public function get_info(): string {
        return gmdate("Y-m-d\TH:i:s\Z", (int) $this->getUnixTime0()) . "\t" . $this->getEntityPointer0() . '->' . $this->getEntityPointer1() . "\t" . $this->get_amount() . "\t" . $this->text0;
    }
}
