<?php declare(strict_types=1);

namespace CodeManager\Entity\Users;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldInt;
use CodeManager\Entity\Abstractions\Traits\Text\FieldText;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;

/**
 * Class EntityUserRole
 * @package CodeManager\Entity\Users
 *
 * @Entity(
 *     repositoryClass="CodeManager\Repository\Users\RepoEntityEntityRole",
 *     readOnly=true
 * )
 * @Table(name="entity_entity_role")
 */
class EntityEntityEntityRole extends AbstractEntity {
    // Name.
    use FieldText;
    // RankID.
    use FieldInt;

    public static $db_table_name = 'entity_entity_role';
}
