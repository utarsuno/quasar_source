<?php declare(strict_types=1);

namespace CodeManager\Entity\Users;
use CodeManager\Entity\Abstractions\Traits\Boolean\FieldBoolean;
use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Text\FieldTextTwo;
use Doctrine\ORM\Mapping as ORM;


/**
 * Class EntityVendor
 * @package CodeManager\Entity\Users
 *
 * @ORM\Entity(repositoryClass="CodeManager\Repository\Users\EntityVendorRepository")
 * @ORM\Table(name="_Code_Manager___Entity___Users___Entity_Vendor_Category")
 */
class EntityVendorCategory {
    use FieldID;
    // Name and description.
    use FieldTextTwo;
    use FieldBoolean;
}
