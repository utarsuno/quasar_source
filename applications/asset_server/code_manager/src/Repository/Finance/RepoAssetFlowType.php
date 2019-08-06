<?php declare(strict_types=1);

namespace CodeManager\Repository\Finance;
use CodeManager\Entity\Finance\EntityAssetFlowType;
use CodeManager\Repository\Abstractions\QueryableRepo;

/**
 * Class RepoAssetFlowType
 * @package CodeManager\Repository\Finance
 */
class RepoAssetFlowType extends QueryableRepo {

    protected $entity_class = EntityAssetFlowType::class;

    # ------------------------------------ A B S T R A C T I O N   C O N T R A C T  ------------------------------------
    public function set_needed_repos(): void {}
}
