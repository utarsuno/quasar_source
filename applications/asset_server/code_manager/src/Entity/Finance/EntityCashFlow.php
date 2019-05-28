<?php

namespace CodeManager\Entity\Finance;

use CodeManager\Entity\Abstractions\Traits\Relations\FieldFromUser;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldFromVendor;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldToUser;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldToVendor;
use CodeManager\Entity\Abstractions\Traits\Text\FieldDescription;
use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityCashFlow
 * @package CodeManager\Entity\Finance
 *
 * @ORM\Entity(repositoryClass="CodeManager\Repository\Finance\EntityCashFlowRepository")
 * @Table(name="cash_flows")
 */
class EntityCashFlow {
    use FieldID;
    use FieldDescription;
    use FieldFromVendor;
    use FieldFromUser;
    use FieldToVendor;
    use FieldToUser;
}
