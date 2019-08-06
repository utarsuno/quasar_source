<?php declare(strict_types=1);

namespace CodeManager\Entity\Users;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointer;
use QuasarSource\Doctrine\Entity\Field\Text\TraitText0;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\Doctrine\Entity\Field\Boolean\TraitBool0;

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
    use TraitText0;

    // Pointer to the User Entity.
    use FieldEntityPointer;

    // Is matching case required.
    use TraitBool0;

    public static $db_table_name = 'entity_entity_alias';

}
