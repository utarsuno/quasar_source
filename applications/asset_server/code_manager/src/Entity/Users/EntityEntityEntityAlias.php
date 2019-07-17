<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 00:06
 */

namespace CodeManager\Entity\Users;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Boolean\FieldBoolean;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointer;
use CodeManager\Entity\Abstractions\Traits\Text\FieldText;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;

/**
 * Class EntityUserAlias
 * @package CodeManager\Entity\Users
 *
 * @Entity(
 *     repositoryClass="CodeManager\Repository\Users\RepoEntityEntityAlias",
 *     readOnly=True
 * )
 * @Table(name="entity_entity_alias")
 */
class EntityEntityEntityAlias extends AbstractEntity {
    // Alias name.
    use FieldText;

    // Pointer to the User Entity.
    use FieldEntityPointer;

    // Is matching case required.
    use FieldBoolean;

    public static $db_table_name = 'entity_entity_alias';



}
