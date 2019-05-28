<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 00:06
 */

namespace CodeManager\Entity\Users;

use CodeManager\Entity\Abstractions\Traits\Relations\FieldHasPointerToUserRole;
use CodeManager\Entity\Abstractions\Traits\Time\FieldCreatedAt;
use CodeManager\Entity\Abstractions\Traits\Text\FieldEmail;
use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Text\FieldName;
use CodeManager\Entity\Abstractions\Traits\Text\FieldPassword;
use CodeManager\Entity\Abstractions\Traits\Time\FieldLastLogin;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityUser
 * @package CodeManager\Entity\Users
 *
 * @Entity(repositoryClass="CodeManager\Repository\Users\EntityUserRepository")
 * @Table(
 *     name="users",
 *     indexes={
 *         @Index(
 *             name="search_entity_users",
 *             columns={"username", "email", "last_login"}
 *         )
 *     }
 * )
 */
class EntityUser {
    use FieldID;
    use FieldCreatedAt;
    use FieldName;
    use FieldPassword;
    use FieldEmail;
    use FieldLastLogin;
    use FieldHasPointerToUserRole;
}
