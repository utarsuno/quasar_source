<?php declare(strict_types=1);

namespace CodeManager\Entity\Finance;

use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldInt;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointerTwo;
use CodeManager\Entity\Abstractions\Traits\Text\FieldText;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityCashFlow
 * @package CodeManager\Entity\Finance
 *
 * @ORM\Entity(repositoryClass="CodeManager\Repository\Finance\EntityCashFlowRepository")
 * @Table(name="cash_flow")
 */
class EntityCashFlow {
    use FieldID;
    // Description
    use FieldText;
    // 0 --> VendorToVendor, 1 --> VendorToUser, 2 --> UserToUser, 3 --> UserToVendor
    use FieldInt;
    // A pointer from Entity and pointer to Entity.
    use FieldEntityPointerTwo;
}
