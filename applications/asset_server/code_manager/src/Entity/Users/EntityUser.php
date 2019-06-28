<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 00:06
 */

namespace CodeManager\Entity\Users;

use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointer;
use CodeManager\Entity\Abstractions\Traits\Text\FieldTextThree;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTimeTwo;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityUser
 * @package CodeManager\Entity\Users
 *
 * @Entity(repositoryClass="CodeManager\Repository\Users\EntityUserRepository")
 * @Table(name="users")
 */
class EntityUser {
    use FieldID;
    // Username, Password, Email.
    use FieldTextThree;
    // The time instance that this account was created at and last logged in at.
    use FieldUnixTimeTwo;
    // A pointer to the EntityUserRole.
    use FieldEntityPointer;
}
