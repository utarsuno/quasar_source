<?php

namespace CodeManager\Entity\Users;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldHasPointerToVendorCategory;
use CodeManager\Entity\Abstractions\Traits\Text\FieldDescription;
use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Text\FieldName;
use Doctrine\ORM\Mapping as ORM;


/**
 * Class EntityVendor
 * @package CodeManager\Entity\Users
 *
 * @ORM\Entity(repositoryClass="CodeManager\Repository\Users\EntityVendorRepository")
 * @ORM\Table(name="vendors")
 */
class EntityVendor {
    use FieldID;
    use FieldName;
    use FieldDescription;
    use FieldHasPointerToVendorCategory;
}
