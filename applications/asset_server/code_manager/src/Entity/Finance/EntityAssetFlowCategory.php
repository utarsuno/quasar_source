<?php declare(strict_types=1);

namespace CodeManager\Entity\Finance;

use CodeManager\Entity\Abstractions\AbstractEntity;
use QuasarSource\Doctrine\Entity\Field\Text\TraitText0;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;

/**
 * Class EntityAssetFlowCategory
 * @package CodeManager\Entity\Finance
 *
 * @Entity(repositoryClass="CodeManager\Repository\Finance\RepoAssetFlowCategory", readOnly=true)
 * @Table(name="asset_flow_category")
 */
class EntityAssetFlowCategory extends AbstractEntity {
    // Description
    use TraitText0;

    /** @var string $db_table_name */
    public static $db_table_name = 'asset_flow_category';
}
