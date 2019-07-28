<?php declare(strict_types=1);

namespace CodeManager\Repository\Finance;
use CodeManager\Entity\Finance\EntityAssetFlowCategory;
use CodeManager\Repository\Abstractions\QueryableRepo;

/**
 * Class RepoAssetFlowCategory
 * @package CodeManager\Repository\Finance
 */
class RepoAssetFlowCategory extends QueryableRepo {

    public const ENTITY_CLASS = EntityAssetFlowCategory::class;
    protected $entity_class   = EntityAssetFlowCategory::class;

    # ------------------------------------ A B S T R A C T I O N   C O N T R A C T  ------------------------------------
    public function set_needed_repos(): void {}
}
