<?php declare(strict_types=1);

namespace CodeManager\Entity\Finance;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointer;
use QuasarSource\Doctrine\Entity\Field\Text\TraitText0;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;

/**
 * Class EntityAssetFlowType
 * @package CodeManager\Entity\Finance
 *
 * @Entity(repositoryClass="CodeManager\Repository\Finance\RepoAssetFlowType")
 * @Table(name="asset_flow_type")
 */
class EntityAssetFlowType extends AbstractEntity {
    // Description
    use TraitText0;
    // Optional: Category
    use FieldEntityPointer;

    /** @var string $db_table_name */
    public static $db_table_name = 'asset_flow_type';
}
