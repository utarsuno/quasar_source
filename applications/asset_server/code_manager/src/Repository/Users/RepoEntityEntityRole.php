<?php declare(strict_types=1);

namespace CodeManager\Repository\Users;

use CodeManager\Entity\Users\EntityEntityEntityRole;
use CodeManager\Repository\Abstractions\QueryableRepo;

/**
 * Class RepoEntityEntityRole
 * @package CodeManager\Repository\Users
 */
class RepoEntityEntityRole extends QueryableRepo {

    protected $entity_class = EntityEntityEntityRole::class;

    # ------------------------------------ A B S T R A C T I O N   C O N T R A C T  ------------------------------------
    public function set_needed_repos(): void {}

}
