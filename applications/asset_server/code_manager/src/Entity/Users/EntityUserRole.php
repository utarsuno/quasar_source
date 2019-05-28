<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 00:06
 */

namespace CodeManager\Entity\Users;

use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Text\FieldName;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldRank;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;

/**
 * Class EntityUserRole
 * @package CodeManager\Entity\Users
 *
 * @Entity(repositoryClass="CodeManager\Repository\Users\EntityUserRoleRepository")
 * @Table(
 *     name="user_roles",
 *     indexes={
 *         @Index(
 *             name="search_entity_user_roles",
 *             columns={"name", "rank"}
 *         )
 *     }
 * )
 */
class EntityUserRole {
    use FieldID;
    use FieldName;
    use FieldRank;
}
